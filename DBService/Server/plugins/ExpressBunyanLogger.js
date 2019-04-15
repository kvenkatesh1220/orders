'use strict';

var _					= require('lodash');
var Logger				= require('bunyan');
var expressBunyanLogger	= require('express-bunyan-logger');
var RotatingFileStream	= require('bunyan-rotating-file-stream');
var PrettyStream		= require('bunyan-prettystream');
var fse					= require("fs-extra");
//var logstash 			= require('bunyan-logstash');
var Elasticsearch		= require('bunyan-elasticsearch');
//var serializers		= require('bunyan-serializers');


/**
The log levels in bunyan are as follows. The level descriptions are best practice opinions of the author.

"fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
"error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
"warn" (40): A note on something that should probably be looked at by an operator eventually.
"info" (30): Detail on regular operation.
"debug" (20): Anything else, i.e. too verbose to be included in "info" level.
"trace" (10): Logging from external libraries used by your app or very detailed application logging.
**/



var MyLogger = (function(){
	var logsDirectory = './logs';
	fse.ensureDirSync(logsDirectory); //Create logs directory if it doesnot already exist.

	/*
	var serializers = {
		err: Logger.stdSerializers.err,
		req: function (requset) {
			req = Logger.stdSerializers.req(request);
			request.body = _.omit(request.body, 'password');
			return req;
		},
		res: Logger.stdSerializers.res
	};
	*/

	var streamOptions = (function(){
		//----------------------------------------------------------------------
		var prettyStdOut = new PrettyStream();
		prettyStdOut.pipe(process.stdout);

		var bformat = require('bunyan-format');
		var formatOut = bformat({ outputMode: 'short' });

		var stdOutStreamOptions = {
			stream: process.stdout,
			//stream: prettyStdOut,
			//stream: formatOut,
			level: 'error',
			serializers : {
				req: function (request) {
					var req_ = Logger.stdSerializers.req(request);
					request.body = _.omit(request.body, 'password');
					return req_;
				}
			}
		};

		//----------------------------------------------------------------------
		var rotatingFileStream = new RotatingFileStream({
			path: logsDirectory + '/log.txt',
			period: '1d',          // daily rotation
			totalFiles: 20,        // keep up to 10 back copies
			rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
			threshold: '1m',      // Rotate log files larger than 10 megabytes
			totalSize: '20m',      // Don't keep more than 20mb of archived log files
			gzip: true             // Compress the archive log files to save space
		});

		var rotatingFileStreamOptions = {
			stream : rotatingFileStream,
			level: 'debug'
		};

		//----------------------------------------------------------------------
		/*var esStream = new Elasticsearch({
			indexPattern: '[logstash-]YYYY.MM.DD',
			type: 'logs',
			host: 'localhost:9200'
		});

		esStream.on('error', function (err) {
			console.log('Elasticsearch Stream Error:', err.stack);
		});

		var elasticSearchStreamOptions =  {
			stream: esStream,
			level : 'info'
		};
		*/

		//----------------------------------------------------------------------
		return {
			stdOutStreamOptions			:	stdOutStreamOptions,
			rotatingFileStreamOptions	:	rotatingFileStreamOptions,
			//elasticSearchStreamOptions	:	elasticSearchStreamOptions
		};
	}());


	// var logger = require('bunyan-adaptor')({
	// 	log: console.log.bind(console),
	// 	info: console.log.bind(console),
	// 	warn: console.log.bind(console),
	// 	error: console.error.bind(console),
	// });


	var logger = new Logger({
		name: 'UC',
		src: true,
		"uc_module" : "expressLogger",
		streams: [
			//streamOptions.stdOutStreamOptions,
			streamOptions.rotatingFileStreamOptions,
			//streamOptions.elasticSearchStreamOptions
		],
		// serializers: {
		// 	req: Logger.stdSerializers.req,
		// 	res: Logger.stdSerializers.res,
		// 	err: Logger.stdSerializers.err
		// }
	});

	//logger.info('Logger is now initialized');

	var expressBunyanLoggerInstance =  expressBunyanLogger({
		logger : logger,
		obfuscate : [
			//what properties of Http request that we want to hide
			"req.body.password"
		],
		//obfuscatePlaceholder : "**hidden**",
		excludes : [
			//'remote-address',
			//'ip',
			//'method',
			//'url',
			//'referer',
			'user-agent',			//This may be required but not at this stage. So excluding for now.
			'body',
			'short-body',
			'http-version',
			//'response-time',
			"response-hrtime",		//output is of format - "response-hrtime": [11,837860550]
			//"status-code",
			//'req-headers',
			'res-headers',
			'req',					//Node Http Request Object
			'res',					//Node Http Response Object
			'incoming',
			//----Below properties are not controlled by express-bunyan-logger and can't be excluded from here.
			//'short-body',
			//'msg',				//A single line message.
			//'time',
			//'src',				//There is no use in printing the path 'node_modules\\express-bunyan-logger\\index.js'
			//'v'
		]
	} );

	return {
		expressBunyanLoggerInstance	: expressBunyanLoggerInstance,
		log							: logger
	};
}());


function getLogger_EmployabilityIndex(logger){
	var childLogger = logger.child({"uc_module" : "EmployabilityIndex", level : "info"});
	return childLogger;
}
var Logger_EmployabilityIndex = getLogger_EmployabilityIndex(MyLogger.log);

function getLogger_Cache(logger){
	var childLogger = logger.child({"uc_module" : "Cache", level : "warn"});
	return childLogger;
}
var Logger_Cache = getLogger_Cache(MyLogger.log);


module.exports 								= MyLogger.expressBunyanLoggerInstance;
module.exports.Logger_EmployabilityIndex 	= Logger_EmployabilityIndex;
module.exports.Logger_Cache 				= Logger_Cache;
