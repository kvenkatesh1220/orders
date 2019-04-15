"use strict"

var _						= require('lodash');
var crudController = require(appRootPath + '/Server/controller/v1/Queries/crud.js');

//--------------------------------------------------------------------------
module.exports = (function(){
	return (function(){

		var insertRecord = function insertRecord(req, res) {
            crudController.insertRecordAsync(req.body)
			.then(function(result){
				res.status(200).json(result);
			})
			.catch(function(err){
				res.status(500).json(err);
			});
        };
        
        var updateRecord = function updateRecord(req, res) {
            crudController.updateRecordAsync(req.body)
			.then(function(result){
				res.status(200).json(result);
			})
			.catch(function(err){
				res.status(500).json(err);
			});
		};

		const findRecordById = (req, res) => {
			const id = req.params.id;
			const collectionName  = req.params.collectionName;
			crudController.findRecordByIdAsync(collectionName, id)
			.then(function(result){
				res.status(200).json(result);
			})
			.catch(function(err){
				res.status(500).json(err);
			});
		}

		const findRecords = (req, res) => {
			const query = req.query;
			const collectionName  = req.params.collectionName; 
			crudController.findRecordsAsync(collectionName, query)
			.then(function(result){
				res.status(200).json(result);
			})
			.catch(function(err){
				res.status(500).json(err);
			});
		}


		return {
            insertRecord	: insertRecord,
			updateRecord : updateRecord,
			findRecordById : findRecordById,
			findRecords : findRecords
		};
	}());
}());

