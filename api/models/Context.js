/**
 * Context.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var Q = require('q'),
   _ = require('lodash');
module.exports = {

  attributes: {
    user: {
      type: 'string',
      columnName: 'user'
    },
    expectedLevelOne: {
      type: 'array',
      defaultsTo: []
    },
    expectedLevelZero: {
      type: 'array',
      defaultsTo: []
    },
    contextLevelZero: {
      type: 'array',
      defaultsTo: []
    },
    contextLevelOne: {
      type: 'array',
      defaultsTo: []
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    }
  },
  getContext: getContext,
  createContext: createContext,
  updateContext: updateContext,
  deleteContext: deleteContext,
  updateCon: updateCon
};

function getContext(topics, user) {
  console.log("hello");
  return Q.promise(function (resolve, reject) {
  Context
  .find({user : user, isDeleted: false, expectedLevelOne: { $in: topics }})
  .then(function(result) {
    console.log(result);
    if(result.length==0) {
      console.log("lko");
      return Context.find({user : user, isDeleted: false, expectedLevelZero: { $in: topics }});
    }
    else {
      return Context
      .updateCon(result[0], topics, user);

    }
  })
  .then(function(result) {
    console.log("hell",result);
    if(result.length==0) {
      return Context.createContext(topics, user);

    }
    else {
      if(result.length==1) {
        var val = {
          context: result[0].contextLevelZero,
          expectedLevelOne: result[0].expectedLevelOne,
          hit: 'zero'
        }
        return resolve(val);
      }
      else {
        var val = {
          context: result[0].contextLevelOne,
          expectedLevelOne: result[0].expectedLevelOne,
          hit: 'one'
        }
        return resolve(val);
      }
    }
  })
  .then(function(context) {
    return resolve(context);
  })
  .catch(function(err) {
    sails.log.error('Context#getContext ::  :: ', err);
    return reject({
      code: 500,
      message: 'INTERNAL_SERVER_ERROR'
    });
  })
})
}

function createContext(topics, user) {
return Q.promise(function (resolve, reject) {
  Context
  .deleteContext(user)
  .then(function() {
    var data = {
    user: user,
    contextLevelOne: topics
  }

  return Context
  .create(data);
  })
  .then(function(context) {
    var val = {
      context: context.contextLevelOne,
      expectedLevelOne: context.expectedLevelOne,
      hit: 'one'
    }
    return resolve(val);
  })
  .catch(function(err) {
    sails.log.error('Context#createContext ::  :: ', err);
    return reject({
      code: 500,
      message: 'INTERNAL_SERVER_ERROR'
    });
})
})
}

function deleteContext(user) {
  return Q.promise(function (resolve, reject) {
    var criteria = {
      user: user,

    }
    var value = {
      isDeleted: true
    }
    Context
    .update(criteria, value)
    .then(function() {
      console.log("delete");
      return resolve();
    })
    .catch(function(err){
      sails.log.error('Context#deleteContext ::  :: ', err);
      return reject({
        code: 500,
        message: 'INTERNAL_SERVER_ERROR'
      });
    })
})
}

function updateContext(levelZero, levelOne, user) {
  return Q.promise(function (resolve, reject) {
    var criteria = {
      user: user,
      isDeleted: false
    }

    var value = {
      expectedLevelOne: levelOne,
      expectedLevelZero: levelZero
    }
    Context
    .update(criteria, value)
    .then(function(response) {
      console.log('updateContext');
    })
    .catch(function(err) {
      console.log("updateContext",err);
    })
  })
}

function updateCon(result, topic, user) {
  return Q.promise(function (resolve, reject) {
    var criteria = {
      user: user,
      isDeleted: false
    }

    var value = {
      contextLevelZero : result.contextLevelOne,
      contextLevelOne : _.union(result.contextLevelOne, topic)
    }
    Context
    .update(criteria, value)
    .then(function(response) {
      var result = _.union(response, [1]);
      console.log("res",result);
      return resolve(result);
    })
    .catch(function(err) {
      sails.log.error('Context#updateCon ::  :: ', err);
      return reject({
        code: 500,
        message: 'INTERNAL_SERVER_ERROR'
      });
    })
  })
}
