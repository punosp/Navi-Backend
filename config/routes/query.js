
module.exports.routes ={
  'post /api/v1/query' : {
    controller : 'QueryController',
    action : 'query'
  },
  'post /api/v1/add' : {
    controller: 'QueryController',
    action: 'add'
  }
};
