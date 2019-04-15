"use strict";

module.exports = function registerRoutes(app){

	/*
	Install various middlewares for the express application
	*/
	require(appRootPath + '/Server/routes/middlewares/CORS')(app);
	// Uptime , Ping , Time Moved to Index.js file as per prasad Suggestions By VK
	var api_v1_routes = require('./api/v1')(app);
	//app.use( "/api/v1",	api_v1_routes );
	console.log("Finished API Routes establishment");

};


/*******************
//TODO : Priority Low - As we tend to have more and more routes (each in separate
// file), we also need to include/require those routes in server.js file and also
// tell the express to use them for specific routing. Was thinking if we can
// have a routes.json file in the routes folder which will define which routes
// to include/require in server.js through a for loop.

g_module_fs.readdirSync(join(appRootPath, 'routes')).forEach(function (file) {
	if (~file.indexOf('.js')){
		//var routes = require(join(appRootPath, 'routes', file));
		console.log("file ==> " + file);
	}

});
**********************/
