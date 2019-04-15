"use strict"

const _ = require('lodash');
const Promise = require('bluebird');
const request = require("request");
const jwt = require('jwt-simple');
const querystring = require('querystring')

const endpoints = require(appRootPath + '/Server/config/endpoints');
const secret = "$<(^(t";
//--------------------------------------------------------------------------

module.exports = (function () {
	return (function () {
		/**
		 * This Method is for sending the requests to Other MicroServices.
		 * @param {*} method 
		 * @param {*} url 
		 * @param {*} body 
		 * @param {*} token 
		 * @param {*} next 
		 */
		function sendRequest(method, url, body, token, next) {
			var options = {
				method: method,
				url: url,
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'application/json'
				},
				json: true
			};
			if (token) {
				options.headers.authorization = token;
			}
			if (body) {
				options.body = body;
			}
			request(options, function (error, response, body) {
				console.log(body);
				if (error) {
					return next(error);
				} else if (response.statusCode !== 200) {
					return next({ message: response.statusMessage });
				} else {
					return next(null, body);
				}
			});

		}
		/**
		 * Create Token will accepts the Payload and returns the JWT Token.
		 * @param {*} payload 
		 */
		function createToken(payload) {
			var token = jwt.encode(payload, secret);
			return token;
		}

		/**
		 * This method is for Getting Order Status Based on the Payment Status.
		 * @param {*} paymentStatus 
		 */
		function getOrderStatusBasedOnPaymentStatus(paymentStatus) {
			const statusMapping = {
				confirmed: 'confirmed',
				declined: 'canceled'
			};
			return statusMapping[paymentStatus];
		}
		const sendRequestAsync = Promise.promisify((sendRequest));
		/**
		 * This is Post Method.
		 * Payload Looks Like.
		 * 	
		 * { "details" : { "name" : "Ram", "amount" : 90  } }
		 * 
		 * STEP 1 : Getting The Endpoint using GetEndpoint function.
		 * STEP 2 : Requesting DB Microservice to save the Payload In DB.
		 * STEP 3 : Based of the response Creating the Token for Payment App.
		 * STEP 4 : Requesting Payment App For Process Payment.
		 * STEP 5 : Based on the payment status Configuring the Order status.
		 * STEP 6 : Updating the Order Record With Payment result.
		 * STEP 7 : Sending Response to the Client.
		 * 
		 * @param {*} body 
		 * @param {*} next 
		 */
		var createOrder = function createOrder(body, next) {
			// STEP 1
			const url = endpoints.getEndPoint('save');
			// STEP 2
			sendRequestAsync('POST', url, body, undefined)
				.catch((err) => {
					throw new Error(err.message);
				})
				.then(function (doc) {
					// STEP 3
					const tokenPayload = {
						"_id": doc._id
					}
					let token = createToken(tokenPayload);
					// STEP 4
					const paymentUrl = endpoints.getEndPoint('payment');
					return sendRequestAsync('POST', paymentUrl, tokenPayload, token);
				})
				.catch((err) => {
					throw new Error(err.message);
				})
				.then((result) => {
					// STEP 5
					const orderStatus = getOrderStatusBasedOnPaymentStatus(result.status);
					result.status = orderStatus;
					/**
					 * Here I am calling Update Function Directly.
					 */
					// STEP 6
					return updateOrderAsync(result)
				})
				.catch((err) => {
					throw new Error(err.message);
				})
				.then((updationResult) => {
					// STEP 7
					return next(null, updationResult);
				})
				.catch(function (err) {
					return next(err);
				});
		};

		/**
		 * 
		 * Based on the received parameters Updating the Order Records.
		 * 
		 * @param {*} body 
		 * @param {*} next 
		 */
		var updateOrder = function updateOrder(body, next) {
			const url = endpoints.getEndPoint('update');
			sendRequestAsync('POST', url, body, undefined)
				.then(function (doc) {
					return next(null, doc);
				})
				.catch(function (err) {
					return next(err);
				});
		};
		const updateOrderAsync = Promise.promisify(updateOrder);

		/**
		 * Checking the token based on the ID. It will return Order status.
		 * In Get Endpoint, Doc Id is captured from Token. So creating the token.
		 * 
		 * @param {*} data 
		 * @param {*} next 
		 */
		const checkStatus = (data, next) => {
			let url = endpoints.getEndPoint('get');
			url = url + data.collectionName + '/' + data._id;
			const tokenPayload = {
				"_id": data._id
			}
			let token = createToken(tokenPayload);
			sendRequestAsync('GET', url, undefined, token)
				.then(function (doc) {
					return next(null, doc);
				})
				.catch(function (err) {
					return next(err);
				});
		}
		/**
		 * 
		 * This function is for updating the Order Docs.
		 * STEP 1 : Creating Query Params using queryString npm package.
		 * STEP 2 : First it will find the All records with matching query ( In this case confirmed ).
		 * STEP 3 : Updating all docs with Delivered Status and pushing promises to Array for single time execution.
		 * STEP 4 : Executing all Promises Once and sending Result to back.
		 * 
		 * @param {*} query 
		 * @param {*} next 
		 */
		const updateStatusToDelivered = (query, next) => {
			let url = endpoints.getEndPoint('find');
			// STEP 1 
			const queryParams = querystring.stringify(query);
			url = url + '?' + queryParams;
			// STEP 2
			sendRequestAsync('GET', url, undefined, undefined)
				.then(function (docs) {
					// STEP 3
					const promisesArray = [];
					_.forEach(docs, (doc) => {
						const data = {
							status : "delivered",
							_id : doc._id
						}
						promisesArray.push(updateOrderAsync(data));
					});
					// STEP 4
					return Promise.all( promisesArray );
				})
				.then((result)=> {
					return next(null, result);
				})
				.catch(function (err) {
					return next(err);
				});
		}

		return {
			createOrder: createOrder,
			createOrderAsync: Promise.promisify(createOrder),
			updateOrder: updateOrder,
			updateOrderAsync: updateOrderAsync,
			checkStatus: checkStatus,
			checkStatusAsync: Promise.promisify(checkStatus),
			updateStatusToDelivered: updateStatusToDelivered,
			updateStatusToDeliveredAsync: Promise.promisify(updateStatusToDelivered)
		};
	}());
}());

