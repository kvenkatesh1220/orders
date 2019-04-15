'use strict';

const endPoints = {
		"save" : "http://localhost:8081/api/v1/db/save",
		"update" : "http://localhost:8081/api/v1/db/update",
		"get" : "http://localhost:8081/api/v1/db/",
		"payment" : "http://localhost:8082/api/v1/payment/process",
		"find" : "http://localhost:8081/api/v1/db/orders"
	};

	function getEndPoint(endPoint){
		return endPoints[endPoint];
	}

module.exports = {
	getEndPoint : getEndPoint
}
