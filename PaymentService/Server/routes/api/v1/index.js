'use strict';

var bearerToken			= require('express-bearer-token');
var hpp					= require("hpp");

module.exports = function(app){

//========================== User Security =====================================

	//https://www.npmjs.com/package/secure-only
	app.use(bearerToken({
		//bodyKey: 'access_token',
		//queryKey: 'access_token',
		headerKey: 'Bearer',
		//reqKey: 'token'
	}));

	//----- Secure routes from HTTP Parameter Pollution-------
	// You could add separate HPP middlewares to each route individually but the
	//day will come when you forget to secure a new route. So secure all routes
	//first and then do whitelist of selected routes.
	app.use(hpp());
	// Add a second HPP middleware to apply the whitelist only to selected route.
	//app.use('/test', hpp({ whitelist: [ 'filter' ] }));

	var authenticateRoute = function authenticateRoute(req, res, next) {
		// if (req.url === '/api/v1/user/token' || req.url === '/api/v1/user/logout' || req.url === '/api/v1/user/register') return next();
		// UserAccountsRoutes.authenticateWithBearer(req, res, next);
		return next();
	};


	//==============================================================================
	// Authenticating via token for all requests (except login, register and logout)
	//==============================================================================
	// app.all('/api/v1/*', authenticateRoute);

	require(appRootPath + "/Server/routes/api/v1/routes.payment")(app);


}; //end
