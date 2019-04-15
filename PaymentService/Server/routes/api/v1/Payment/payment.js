"use strict"

var _			= require('lodash');
var paymentController = require(appRootPath + '/Server/controller/v1/Payment/paymentController.js');

//--------------------------------------------------------------------------
module.exports = (function(){
	return (function(){

		var processTransaction = function processTransaction(req, res) {
			const body = req.body;
			// Just Using Token Info.
			body._id = _.get(res, "locals.decodeToken._id", body._id);
            paymentController.processTransactionAsync(body)
			.then(function(result){
				return res.status(200).json(result);
			})
			.catch(function(err){
				return res.status(500).json(err);
			});
        };
        

		return {
            processTransaction	: processTransaction
		};
	}());
}());

