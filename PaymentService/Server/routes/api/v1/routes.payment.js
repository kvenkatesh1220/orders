'use strict';

const _ = require('lodash');
const jwt = require('jwt-simple');

const secret = "$<(^(t";

module.exports = function(app){

	function decodeToken(req, res, next) {
		const token = _.get(req, "headers.authorization", undefined);
		if(token) {
			var decoded = jwt.decode(token, secret);
			res.locals.decodeToken = decoded;
			next();
		} else {
			return res.status(401).json({message: "Token Not Found. You don't have permissions."});
		}
		
	}
	app.use('/api/*', decodeToken);
	var payment			= require(appRootPath + "/Server/routes/api/v1/Payment/payment");

	app.post("/api/v1/payment/process", payment.processTransaction);

}; //end
