var _ = require("lodash");
var mongoose = require("mongoose");
var QueryPlugin = require("mongoose-query");
mongoose.Promise = require("bluebird");

var order_schema = new mongoose.Schema({
	details: {
		name: { type: String },
		amount: { type: Number },
		status: {
			type: String,
			enum: ['created', 'confirmed', 'delivered', 'cancelled'],
			default: 'created'
		}
	},
	update_date: { type: Date } // to record the last update

});


order_schema.pre('save', function (next) {
	"use strict";

	if (!_.isNil(this.get("contact.email"))) {
		this.update_date = new Date();
	}

	next();
});

// This pre hook will be called for both findOneAndUpdate() and findByIdAndUpdate()
order_schema.pre('findOneAndUpdate', function (next) {
	"use strict";
	this.update({ $set: { update_date: new Date() } });
	next();
});

//This pre hook will be called for findByIdAndRemove() and findOneAndRemove()
order_schema.pre('findOneAndRemove', function (err, next) {
	"use strict";
	console.error('findOneAndRemove cannot be performed on order_schema');
	next(err);
});


order_schema.plugin(QueryPlugin);

var collectionName = 'orders';
var Order = mongoose.model('Order', order_schema, collectionName);


var Promise = require('bluebird');
Promise.promisifyAll(Order);
Promise.promisifyAll(Order.prototype);

module.exports = Order;
module.exports.order_schema = order_schema;
