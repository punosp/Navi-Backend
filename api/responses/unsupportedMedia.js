/* global module */
'use strict';
/**
 * 415 (Unsupported Media Type) Handler
 *
 * Usage:
 * return res.unsupportedMedia();
 * return res.unsupportedMedia(message);
 *
 * e.g.:
 * ```
 * return res.unsupportedMedia('Media type not supported');
 * ```
 */

module.exports = function(message) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req,
    res = this.res,
    statusCode = 415,
    sails = req._sails,
    defaultMessage = 'Media type not supported',
    envelope = {
      status: 'error',
      error: {
        errorCode: statusCode
      }
    };

  // Set status code
  res.status(statusCode);

  // Log error to console
  if (message !== undefined) {
    // add message to the envelope
    envelope.error['message'] = message;
    // log to the console
    sails.log.error('@unsupportedMedia - Client Error - ', message);
  }
  else {
    // add message to the envelope
    envelope.error['message'] = defaultMessage;
    sails.log.error('@unsupportedMedia - Client Error - No Message');
  }

  // If the user-agent wants JSON, always respond with JSON
  if (req.wantsJSON) {
    return res.jsonx(envelope);
  } else {
    return res.view('errorResponse', {message: message}, function (err, html) {
      if (err) {
        if (err.code === 'E_VIEW_FAILED') {
          sails.log.error('@unsupportedMedia :: Could not locate view for error page');
        }
        // Otherwise, if this was a more serious error, log to the console with the details.
        else {
          sails.log.error('@unsupportedMedia :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
        }
        return res.jsonx(envelope);
      }
      return res.send(html);
    });
  }

};

