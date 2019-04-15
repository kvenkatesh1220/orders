module.exports = {
	"Database" : {
		"MongoDb" : {
			"url" :	"mongodb://127.0.0.1:27017/dev"
		}
	},

	"WebServer" : {
		//http://stackoverflow.com/questions/7450940/automatic-https-connection-redirect-with-node-js-express
		//http://stackoverflow.com/questions/10697660/force-ssl-with-expressjs-3

		//We may need to run both http and https server, and redirect the
		//http traffic to https. Be careful to not redirect the requests
		//whose request's content-type is not 'application/json'

		//Probably we need to convert runOnlyInSecureMode to
		//webServerSecurityMode="Secure|NonSecure|Both"
		"runOnlyInSecureMode" : false,
		"domainName" : "localhost:8082",
		"publicAccessibleUrl" : "http://localhost:8082", // This param can exists out side of "WebServer" object.
		"port" : {
			//Default secure port is 443. Do not change this value for production.
			"secure" : 443,

			//Default non secure port is '80'. Our production server is always
			//expected to run secure mode.
			"nonSecure" : 8082,
		}
	},

	// Email Client configurations are not needed for development environment
	"EMail" : {
		"key" : '',
		"secret" : '',
		"amazon_mail_server" : ''
	},

	"S3" : {
        "maxAsyncS3": 20,
        "s3RetryCount": 3,
        "s3RetryDelay": 1000,
        "multipartUploadThreshold": 20971520,
        "multipartUploadSize": 15728640,
        "s3Options": {
            "accessKeyId": "",
            "secretAccessKey": "",
            "region" : "ap-southeast-1"
        }
    },

	//Used for mongoose Account model.
	"Account" : {
		/**
		* Millis conversions cheat sheet:
		* 1 second: 1000
		* 1 minute: 60000
		* 10 minutes: 600000
		* 30 minutes: 1800000
		* 1 hour: 3600000
		* 12 hours: 43200000
		* 24 hours: 86400000
		* 1 week: 604800000
		*/
		'ttl': 60000, //3600000, //1 hour
		'resetTokenExpiresMinutes': 20, //20 minutes later
	}
};
