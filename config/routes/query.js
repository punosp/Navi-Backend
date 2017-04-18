
module.exports.routes ={
  'get /api/v1/query/:query' : {
    controller : 'QueryController',
    action : 'query'
  },
  'post /api/v1/add' : {
    controller: 'QueryController',
    action: 'add'
  }
};
