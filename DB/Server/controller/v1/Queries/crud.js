"use strict"

const _ = require('lodash');
const Promise = require('bluebird');

const OrderModel = require(appRootPath + "/Server/model/OrderModel");

//--------------------------------------------------------------------------

function getModel(modelName) {
	let model = '';
	switch (modelName) {
		case "order":
			model = OrderModel;
			break;
		default:
			model = OrderModel;
			break;
	}

	return model;
}

module.exports = (function () {
	return (function () {

		var insertRecord = function insertRecord(data, next) {
			var mongooseModel = getModel(_.get(data, "collectionName", ''));
			console.log("[" + __filename + ":" + __line + "]" + __function);
			const newModel = new mongooseModel();
			newModel.details = {
				name: data.details.name,
				amount: data.details.amount,
				status: 'created'
			}
			newModel
				.saveAsync()
				.then(function (doc) {
					return next(null, doc);
				})
				.catch(function (err) {
					return next(err);
				});
		};

		var updateRecord = function updateRecord(data, next) {
			var mongooseModel = getModel(_.get(data, "collectionName", ''));
			console.log("[" + __filename + ":" + __line + "]" + __function);
			mongooseModel
				.findByIdAndUpdateAsync(data._id,
					{ $set: { "details.status": data.status } },
					{
						upsert: false,
						returnNewDocument: true
					})
				.then(function (doc) {
					if(_.isNil(doc)){
						throw new Error("Unable to perform this operation. Please contact Admin.");
					} else {
						return next(null, {"_id" : doc._id});
					}
				})
				.catch(function (err) {
					return next(err);
				});
		};

		const findRecordById = (collectionName, docId, next) => {
			var mongooseModel = getModel(collectionName);
			console.log("[" + __filename + ":" + __line + "]" + __function);
			mongooseModel
				.findByIdAsync(docId)
				.then(function (doc) {
					if(_.isNil(doc)){
						throw new Error("Unable to perform this operation. Please contact Admin.");
					} else {
						return next(null, doc);
					}
				})
				.catch(function (err) {
					return next(err);
				});
		}

		const findRecords = (collectionName, query, next) => {
			var mongooseModel = getModel(collectionName);
			console.log("[" + __filename + ":" + __line + "]" + __function);
			mongooseModel
				.find(query)
				.then(function (doc) {
					if(_.isNil(doc)){
						throw new Error("Unable to perform this operation. Please contact Admin.");
					} else {
						return next(null, doc);
					}
				})
				.catch(function (err) {
					return next(err);
				});
		}

		return {
			insertRecord: insertRecord,
			insertRecordAsync: Promise.promisify(insertRecord),
			updateRecord: updateRecord,
			updateRecordAsync: Promise.promisify(updateRecord),
			findRecordById : findRecordById,
			findRecordByIdAsync : Promise.promisify(findRecordById),
			findRecords : findRecords,
			findRecordsAsync : Promise.promisify(findRecords)
		};
	}());
}());

