"use strict"

const _ = require('lodash');
const Promise = require('bluebird');
const request = require("request");

const endpoints = require(appRootPath + '/Server/config/endpoints');

//--------------------------------------------------------------------------

module.exports = (function () {
	return (function () {
		function transactionStatus(){
			const randomNum = Math.floor((Math.random() * 100000) + 1)%2;
			return randomNum ? 'confirmed' : 'declined';
		}

		var processTransaction = function processTransaction(body, next) {
			setTimeout(() => {
				const status = transactionStatus();
				const returnObj = {
					"_id" : body._id,
					"status" : status
				}
				return next(null, returnObj);
			}, 1000);
		};

		return {
			processTransaction: processTransaction,
			processTransactionAsync: Promise.promisify(processTransaction)
		};
	}());
}());

