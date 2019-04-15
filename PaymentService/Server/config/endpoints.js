'use strict';

const endPoints = {
		"order_save" : "http://localhost:8081/api/v1/save",
		"order_update" : "http://localhost:8081/api/v1/update",
		"payment" : ""
	};

	function getEndPoint(endPoint){
		return endPoints[endPoint];
	}

module.exports = {
	getEndPoint : getEndPoint
}
