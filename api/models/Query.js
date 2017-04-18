/**
 * Query.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var Q = require('q'),
   _ = require('lodash'),
   nlp = require('compromise');;

module.exports = {

  attributes: {
    user: {
      type: 'string',
      columnName: 'user'
    },
    query : {
      type: 'string',
      columnName: 'query'
    },
    topics : {
      type: 'array',
      defaultsTo: []
    },
    isResolved : {
      type: 'boolean',
      defaultsTo: false
    }
  },
  matchTags: matchTags
};

function matchTags(data, user) {
  return Q.promise(function (resolve, reject) {
    console.log("hello");
    var noun = [], topic = [], topics = [],temp;
    var raw = nlp(data);
     noun = nlp(data).nouns().toSingular().out('array');
     console.log(noun);
     topic = raw.topics().not('#Possessive').out('array');
     console.log(topic);
     topics = _.union(noun, topics);
     console.log(topics);
     //console.log("hello");
    Data
    .getResult(topics, user)
    .then(function(response) {
      if(response.match == 'partial') {
        var result = {
          code: 1,
          data: response
        }
        return resolve(result);
      }
      else {
        var result = {
          code: 2,
          data: response
        }
        return resolve(result);
      }
    })
    .catch(function(err) {
      console.log('Query',err);
      var result = {
        code: 0,
        data:"Not Found"
      }
      return reject(result);
    })

  })
}
