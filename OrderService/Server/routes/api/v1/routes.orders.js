'use strict';

const _ = require('lodash');

module.exports = function(app){

	function populateCollectionName(req, res, next) {
		_.set(req, 'body.collectionName', "order");
		next();
	}

	app.use('/api/*', populateCollectionName);

	var order	= require(appRootPath + "/Server/routes/api/v1/Orders/order");

		app.post("/api/v1/orders/save", order.createOrder);
		app.post("/api/v1/orders/update", order.updateOrder);
		app.post("/api/v1/orders/:orderId([0-9a-f]{24})/cancel", order.cancelOrder);
		app.get("/api/v1/orders/:orderId([0-9a-f]{24})/status", order.checkStatus);
		var a = 1;
		setInterval(() => {
			// This is Not Good way of Implementing. Need to write CRON Job By taking latest modified Date.
			order.updateStatusToDelivered({ "details.status" : "confirmed" });
		}, 120000 );

}; //end
