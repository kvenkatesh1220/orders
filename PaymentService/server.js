/*jshint node: true */
/*jslint node: true */
'use strict';

var express					= require('express');
var fs						= require("fs");
var path					= require('path');
var join					= path.join;
var bodyParser				= require('body-parser');

/*
Set appRootPath

__dirname always represents current direcroty name in which the file is present.
We need to store the rootPath for cases where we want to know the home directory
of the server.
*/
global.appRootPath = path.resolve(__dirname);
global.appStartTime = new Date();

/*
Import a custom logging utilities module.
In order to debug effeciently through logs, we need file name, function name
and line numbers. This module provides line number and function name to the
log content.
	__line
	__function
*/
var loggingUtilities = require("./Server/plugins/CustomLoggingUtilities");

/*
Initialize our database module.
This module connects to our database and also watches the database connection
for any connection error or disconnection, which it currently just logs.
*/
// var g_database = require('./Server/plugins/DataBase');
// g_database.initialize();


/*
Create express.js application and configure the routes that need to be served
by the web server.
*/
var app = express();

// var Logger = require("./Server/plugins/ExpressBunyanLogger.js");
// app.use(Logger);

//app.log("Server.js - Bunyan Logger is initialized successfully");


// Configure passport

//app.use(g_module_cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({
		limit: '1mb', type:'application/json'
	})
);

/*
specify limit so that the app doesn't blindly reject the file/image
upload with "request entity too large: 413"
*/
app.use(bodyParser.urlencoded({
		limit: '2mb',
		extended: true
		/* , type:'application/x-www-form-urlencoding' */
	})
);

require("./Server/routes/requestRouter")(app);


/*
Start the web server.
The server mode (Http / Https) is retrieved from Config
*/
var WebServer = require("./Server/plugins/webServer/webServer");
var server = WebServer.createServerInstance(app);
WebServer.start(server);
