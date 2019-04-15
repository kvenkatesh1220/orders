"use strict";

var cors					= require('cors');

//https://www.npmjs.com/package/has-cors

/*
Enable CORS for the server application
*/
module.exports = function(app){
	app.use(cors());
	/*  >> https://github.com/expressjs/cors
	var whitelist = ['http://localhost', 'https://localhost'];
	var corsOptions = {
		origin: function(origin, callback){
			console.log("\n\norigin=" + origin);
			var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
			console.log("originIsWhitelisted=" + originIsWhitelisted);
			callback(null, originIsWhitelisted);
		}
	};
	app.use(cors(corsOptions));
	*/

};


//Inspiration from : https://github.com/strongloop-community/express-example-modular/tree/master/lib/middleware

//http://enable-cors.org/server_expressjs.html
/*
module.exports = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};
*/
