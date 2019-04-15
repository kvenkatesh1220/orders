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
Include all models js files.
Technically this is not required as we are not using the models here in this file.
We are only including them here so that we get any compilation errors upfront.
When we have a build process, then we can move this snippet to a build process
that includes all these models to check for compilatio errors.

UPDATE : Somewhere, I read that doing this is good for mongoose because if the
model is not loaded before routes, then we might get "Mongoose Schema hasn't been registered for model"
*/

fs.readdirSync(join(__dirname, 'Server/model/')).forEach(function (file) {
	if (file.endsWith('.js')){
		var filePath = join(__dirname, 'Server/model', file);
		require( filePath );
	}
});


/*
Initialize our database module.
This module connects to our database and also watches the database connection
for any connection error or disconnection, which it currently just logs.
*/
var g_database = require('./Server/plugins/DataBase');
g_database.initialize();


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
