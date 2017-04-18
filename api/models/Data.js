/**
 * Data.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var Q = require('q'),
   _ = require('lodash');

 module.exports = {

   attributes: {

     name: {
       type: 'string',
       columnName: 'name'
     },
     hasChild: {
       type: 'boolean',
       columnName: 'hasChild',
       defaultsTo: false
     },
     isDeleted: {
       type: 'boolean',
       columnName: 'is_deleted',
       defaultsTo: false
     },
     question: {
       type: 'string',
       columnName: 'question',
     },
     answer: {
       type: 'string',
       columnName: 'answer',
     },
     choices: {
      type: 'array',
      defaultsTo: []
    },
     topics: {
       type: 'array',
       defaultsTo: []
     },
     verbs: {
       type: 'array',
       defaultsTo: []
     },
     adverbs: {
       type: 'array',
       defaultsTo: []
     },
     adjectives: {
       type: 'array',
       defaultsTo: []
     }
   },


  // addNewTag: addNewTag
  getResult: getResult,
  putData: putData

 };

 function getResult(topics, user) {
   return Q.promise(function (resolve, reject) {
   var searchTags,value;
   console.log("getContext");
   Context
   .getContext(topics, user)
   .then(function(val) {
     value = val;
     console.log("val1",value);
     searchTags = _.union(value.context, topics);
     console.log(searchTags);
     return Data.find({topics: { $all: searchTags }});
   })
   .then(function(result) {
     console.log("hello");
     var max = 0, pos = -1, i=0;
     _.forEach(result, function(value) {

       var s = parseFloat(searchTags.length)/parseFloat(value.topics.length);
       if(s > max) {
         max = s;
         pos = i;
       }
       i++;
    })
    if(pos==-1) {
      Data
      .find({topics: { $in: searchTags }})
      .then(function(result) {
      var max = 0, pos = -1, i=0;
      _.forEach(result, function(value) {

        var s = parseFloat(topics.length)/parseFloat(value.topics.length);
        if(s > max) {
          max = s;
          pos = i;
        }
        i++;
     })

     if(pos==-1) {
       sails.log.error('Data#getREsult :: error -1');
        return reject({
          code: 400,
          message: 'USER_INVALID_REQUEST'
        });
     }
     else {
       var response = {
         match: 'partial',
         data: result[pos],
         score: max
       }

       return resolve(response);
     }
     })
     .catch(function(err) {
       sails.log.error('Data#getREsult :: er',err);
        return reject({
          code: 400,
          message: 'USER_INVALID_REQUEST'
        });
     })
    }
    else {
      var response = {
        match: 'full',
        data: result[pos],
        score: max
      }
      console.log("value.hit",value.hit);
      if(value.hit == 'one') {
      Context
      .updateContext(value.expectedLevelOne, result[pos].choices, user)
      .then(function() {
        console.log("done");
      })
      .catch(function(err) {
        sails.log.error('Data#getREsult :: ',err);
      })
    }
      return resolve(response);
    }
   })
   .catch(function(err) {
     sails.log.error('Data#getREsult :: er',err);
      return reject({
        code: 400,
        message: 'USER_INVALID_REQUEST'
      });
   })
 })
 }

 function putData(data) {
   return Q.promise(function (resolve, reject) {
     var value = {
       name: data.name,
       hasChild: data.hasChild,
       question: data.question,
       answer: data.answer,
       choices: data.choices,
       topics: data.topics
     }

     Data
     .create(value)
     .then(function(record) {
       return resolve(record);
     })
     .catch(function(err) {
       console.log("#Data :: addAction ::",err);
       return reject({
         code : 500,
   			message: 'INTERNAL_SERVER_ERROR'
       })
     })
   })
 }
