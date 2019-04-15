"use strict"

const _			= require('lodash');
const orderController = require(appRootPath + '/Server/controller/v1/Orders/orderController.js');

//--------------------------------------------------------------------------
module.exports = (function(){
	return (function(){
		/**
		 * Checking for Required Data. If not sending Response back from here.
		 * 
		 * @param {*} req 
		 * @param {*} res 
		 */
		const createOrder = function createOrder(req, res) {
			const body = req.body;
			if(_.isNil(_.get(body, "details.name", undefined))) {
				return res.status(206).json({message : "Name is Required."});
			}
            orderController.createOrderAsync(body)
			.then(function(result){
				return res.status(200).json(result);
			})
			.catch(function(err){
				return res.status(500).json(err);
			});
        };
        /**
		 * Route for Update Order.
		 * @param {*} req 
		 * @param {*} res 
		 */
        const updateOrder = function updateOrder(req, res) {
            orderController.updateOrderAsync(req.body)
			.then(function(result){
				return res.status(200).json(result);
			})
			.catch(function(err){
				return res.status(500).json(err);
			});
		};
		/**
		 * Route for Cancel Order.
		 * @param {*} req 
		 * @param {*} res 
		 */
		const cancelOrder = (req, res) => {
			const body = req.body;
			body.status = 'cancelled';
			body._id = req.params.orderId;
			orderController.updateOrderAsync(body)
			.then(function(result){
				return res.status(200).json({message : "Order Cancelled Successfully."});
			})
			.catch(function(err){
				return res.status(500).json(err);
			});
		}
		/**
		 * Route Mehtod for Check Status.
		 * @param {*} req 
		 * @param {*} res 
		 */
		const checkStatus = (req, res) => {
			const data = req.body;
			data._id = req.params.orderId;

			orderController.checkStatusAsync(data)
			.then(function(result){
				return res.status(200).json({ status : result.details.status });
			})
			.catch(function(err){
				return res.status(500).json(err);
			});
		}
		/**
		 *  updating the status to Deliverd.
		 * @param {*} query 
		 */
		const updateStatusToDelivered = (query) => {
			orderController.updateStatusToDeliveredAsync(query)
			.then(function(result){
				console.log(result);
			})
			.catch(function(err){
				console.error(err);
			});
		}
		return {
            createOrder	: createOrder,
			updateOrder : updateOrder,
			cancelOrder : cancelOrder,
			checkStatus : checkStatus,
			updateStatusToDelivered : updateStatusToDelivered
		};
	}());
}());

