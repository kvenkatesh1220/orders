'use strict';

var JSONPath	= require('JSONPath');

var Config = (function () {
	var __private = {
		"Database" : {
			"MongoDb" : {
				"url" :	"mongodb://127.0.0.1:27017/prod"
			}
		},

		"WebServer" : {
			"domainName" : "",
			"publicAccessibleUrl" : "",// This param can exists out side of "WebServer" object.
			"port" : {
				"nonSecure" : 8082,
			},
		}

	};

	return __private;
}());

module.exports = Config
