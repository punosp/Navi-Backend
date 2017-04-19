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
    var slang = raw.match('how are you').found;
    var info = raw.match('about yourself').found;
    var lang = raw.match('programming language').found;
    var dbs = raw.match('database').found;

    if(slang) {
      var res = {
        code: 11,
        data: "I am awesome"
      }
      return resolve(res);
    }
    if(info) {
      var res = {
        code: 11,
        data: "I am an intelligent AI made by Ashutosh Sonu, Abhijeet Saxena, Shalabh Mangal and Marghub Akhtar. I can understand human language "+
        "and also respond in the same. I am built in Node.js programming language over sails js frame work."+
        "Currently I am unable to procees quantity actions and emotions. I am here to make your life easier."
      }
      return resolve(res);
    }
    if(lang) {
      var res = {
        code: 11,
        data: "I am built in Node.js programming language over sails js frame work."
      }
      return resolve(res);
    }
    if(dbs) {
      var res = {
        code: 11,
        data: "I am currently using MongoDB database."
      }
      return resolve(res);
    }
    if(dbs) {
      var res = {
        code: 11,
        data: "I am currently deployed on amazon aws cloud."
      }
      return resolve(res);
    }
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
