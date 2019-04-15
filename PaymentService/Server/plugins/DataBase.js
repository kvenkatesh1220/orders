'use strict';

var mongoose = require('mongoose');
var Fawn = require("fawn");

/**
 * Inject pagination function into mongoose schema.
 *
 * As far as I understand from reading the source code in mongoose-pagination,
 * the 'total' is always computed. So do not use the pagination function
 * if you dont need the total matcching documents count.
 */
require("mongoose-pagination");

/* Set bluebird as default promises library for mongoose. This is done because
the mpromise library of mongoose is deprecated. */
mongoose.Promise = require('bluebird');

var Config	= require(appRootPath + "/Server/config/config.js");

var Database = (function () {
	var mongoDb = {
		"url" :  Config.get("Database.MongoDb.url")  //"mongodb://127.0.0.1:27017/test"
	};

	return {
		"initialize" : function initialize() {

			var mongooseConnection = mongoose.createConnection( mongoDb.url );

			//http://mongodb.github.io/node-mongodb-native/2.1/api/ReplSet.html
			var mongooseConnectionOptions = {
				// db: {
				// 	native_parser: true
				// },
				server: {
					poolSize: 10,
					socketOptions: {
						socketTimeoutMS: 0,		//Default value is 0 or null (implies infinite)
						connectTimeoutMS: 900000
					},
					numberOfRetries : 2,
					retryMiliSeconds : 5000,		//default 5000 ms
				},
				// replset: {
				// 	rs_name: 'myReplicaSetName'
				// },
				// user: 'myUserName',
				// pass: 'myPassword'
			}


			mongoose.set('debug', true);

			/* 	READ_ME   - try to optimize this function for your debug needs, otherwise you will see overwhelming logs. Dont blindly uncomment
			mongoose.set('debug', function (collectionName, method, query, doc) {
				console.log("Mongoose :- collectionName=" + collectionName + ", method="+ method);
				//if(method === "update"){
					//Printing the doc for a find, findById, ... etc ... is confusing on first look. I suppose they are available only for update queries.
					console.log("Mongoose :- doc =" + JSON.stringify(doc) );
				//}
			});
			*/

			//https://stackoverflow.com/questions/22786374/queries-hang-when-using-mongoose-createconnection-vs-mongoose-connect
			//https://github.com/Automattic/mongoose/issues/4413
			mongoose.connect(
				mongoDb.url,
				//mongooseConnectionOptions,
				function onConnect(err){
					if(err){
						throw err;
					}
				}
			);

			mongooseConnection.on('connected', function onConnected() {
				console.log("Mongoose connected");
			});

			mongooseConnection.on('error',function onError(err) {
				console.error("Mongoose default connection error: " + err);
			});

			mongooseConnection.on('disconnected', function onDisconnected() {
				console.error("Mongoose default connection disconnected");
			});

			mongooseConnection.once('open', function onFirstTimeOpen(msg) {
				console.log("Mongoose default connection open to " + mongoDb.url );
			});

			Fawn.init(mongoose);
			// If the Node process ends, close the Mongoose connection
			process.on('SIGINT', function onProcessSIGINT() {
				mongooseConnection.close(function close() {
					console.log("Mongoose default connection disconnected through app termination");
					process.exit(0);
				});
			});

			return mongooseConnection;
		}
	};
}());

module.exports = Database;
