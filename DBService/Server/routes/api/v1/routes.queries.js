'use strict';

module.exports = function(app){


	var crud			= require(appRootPath + "/Server/routes/api/v1/Queries/crud");

		app.post("/api/v1/db/save", crud.insertRecord);
		app.post("/api/v1/db/update", crud.updateRecord);
		app.get("/api/v1/db/:collectionName/:id", crud.findRecordById);
		app.get("/api/v1/db/:collectionName", crud.findRecords)

}; //end
