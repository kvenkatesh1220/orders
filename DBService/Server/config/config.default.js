'use strict'
var JSONPath	= require('JSONPath');

var Config = (function () {
	var __private = {
		"Database" : {
			"MongoDb" : {
				"url" :	"mongodb://127.0.0.1:27017/default"
			}
		},
		"Queue" : {
			"kue" : {
				"Redis" : {
					"host"	: "127.0.0.1",
					"port"	: 6379,
					"db"	: 0,	//DO NOT CHANGE. Due to some issues with kue, could not change the db to anything other than 0. Need more work on this.
					"keyPrefix" : "q"
				}
			}
		},
		"Cache" : {
			"Redis" : {
				"host"	: "127.0.0.1",
				"port"	: 6379,
				"db"	: 1
			}
		},
		"WebServer" : {
			"runOnlyInSecureMode" : false,
			"domainName" : "localhost",
			"publicAccessibleUrl" : "", // This param can exists out side of "WebServer" object.
			"port" : {
				"secure" : 443,
				"nonSecure" : 8080,
			}
		},
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
				"region" : ""
			}
		},

		"SMS" : {
			"url" : "",
			"user" : '',
			"password" : '',
			"sid" : '',
			"otp_validity": 21600,	// 6 hours
			"OTP_TEMPLATE_TEXT": "%OTP% is your One Time Password (OTP) for %REASON% - UC Admin"
		},

		"Account" : {
			'ttl': 60000,
			'resetTokenExpiresMinutes': 20,
		},
		"Features" : {
			"swagger-stats" : {
				"enabled" : false,
				"options" : {
					"authentication" : {
						"enable" : true,
						"username" : "",
						"password" : ""
					}
				}
			},
			"registrations" : {
				//"allowTypes" : {
				
				//},
				"superviseTypes" : {
					
				},
				"superviseTypes_help" : "Only supervise certain registration types"
			}
		},

		"Cron" : {
			"runCronJobsInsideApiServer" : false,
			"collegeSummaryUpdate" : {
				enabled : true,
				interval : "*/2 * * * *",
				initialDelay : 30000 // Triggering Job after 30 sec to update College Summary Doc for the First Time in Server.js file.
			}
			// "jobs" : [
			// 	{
			// 		"name" : "Compute_Academic_Status_And_Employability_Index_Comparisions"
			// 	}
			// ],			
		},
		"DBBackup": {
			"backupPath": "./db/backup/", 
			"backupCollectionNames": [],
			"cron":"*/1 * * * *", //"0 0 12 1/1 * ? *",
			"s3" : {
				"enabled" : true,
				"uploadPath" : "",
			}
		},
		"DBRestore": {
			"targetDBUri" : "mongodb://127.0.0.1:27017/backup1",
			"backupFilePath": "./db/restore/",
			"dropCollections": [],
			"restoreFileName" : "test4_8_Feb_2018_17_52.tar"
		}
	};

	return __private;
}());

module.exports = Config;
