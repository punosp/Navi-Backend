/**
 * QueryController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	_config : {
  shortcuts : false,
  actions : false,
  rest : false
	},
	query: queryAction,
	add: addAction
};

function queryAction(req, res) {
	//return res.handleError("hello");

	var data = req.param("query");
	var user = req.param("user");
	//console.log(q);
	Query
	.matchTags(data, user)
	.then(function(result) {
		return res.success(result);
	})
	.catch(function(err) {
		console.log(err);
		var er = {
			code : 500,
			message: 'INTERNAL_SERVER_ERROR'
		}
		return res.handleError(er);
	})

}

function addAction(req, res) {
	var data = req.body;
	console.log(data);
	Data
	.putData(data)
	.then(function(record) {
		return res.success(record);
	})
	.catch(function(err) {
		return res.handleError(err);
	})
}
