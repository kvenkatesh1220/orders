"use strict";

var fse			= require("fs-extra");
var _			= require("lodash");
var JSONPath	= require("JSONPath");
var jsonfile	= require("jsonfile");
/*
Config is READ_ONLY object storing various configuration information.
Any one wants to read the cofiguration properties, they can do so
by calling Config.get("abc.xyz")


Any developer/UC-Admin who wants to use different configurations for development
or testing, can copy the config.xyz.js to /DeveloperConfig/config.developer.js
*/

var Config = (function initConfig(){
	var configToUse = {
		aboutConfig : {
			//Since our config file is a merger of default + env + custom configuration
			//files, this timestamp will help us debug any problems with merging.
			creationTimestamp : new Date()
		}
	}

	var pathOfConfigFileInUse = global.appRootPath + "/Server/config/DeveloperConfig/config.inUse.json";
	var isExists_configFileInUse = false;
	try {
		isExists_configFileInUse = fse.statSync(pathOfConfigFileInUse).isFile();
	}
	catch(err){
	}

	if(isExists_configFileInUse){
		configToUse = require("./DeveloperConfig/config.inUse");
		console.log("Using config file '" + pathOfConfigFileInUse + "', which is created at " + configToUse.aboutConfig.creationTimestamp);
	}
	else{
		var customConfigFilePath = global.appRootPath + "/Server/config/DeveloperConfig/config.developer.js";
		console.log("Checking if Developer Specific file exists or not \n("+customConfigFilePath+")");

		var customConfigFileExists = false;
		try {
			customConfigFileExists = fse.statSync(customConfigFilePath).isFile();
		}
		catch(err){
			//Developer specific file does not exist.
			// No problem, use what ever is configured in NODE_ENV or use default
		}

		console.log("Custom config file found = " +  customConfigFileExists);
		console.log("Check the NODE environment for type of config file to use");
		var environment = process.env.NODE_ENV;
		console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
		var defaultConfig = require("./config.default");

		var envConfig = null;
		environment = "development";

		switch(environment){
			case 'development': {
				console.log("Merging config.development to config.default\n");
				envConfig = require("./config.development");
				break;
			}
			case 'production': {
				console.log("Merging config.production to config.default\n");
				envConfig = require("./config.production");
				break;
			}
			default: {
				console.log("No environment specified to choose config file.");
				//process.exit(1);
			}
		}

		var customConfig;
		if(customConfigFileExists){
			customConfig = require(customConfigFilePath);
		}

		//console.log("defaultConfig = " + JSON.stringify(defaultConfig, 0,2) );

		//console.log("envConfig = " + JSON.stringify(envConfig, 0,2) );

		//console.log("customConfig = " + JSON.stringify(customConfig, 0,2) );

		//configToUse = _.defaultsDeep(customConfig, defaultConfig);
		configToUse = _.merge(configToUse, defaultConfig, envConfig, customConfig);
		

		console.log("configuration in use = " + JSON.stringify(configToUse, 0,2) );

		jsonfile.writeFile(pathOfConfigFileInUse, configToUse, {spaces: 4}, function writeConfigToFile(err, result) {
			if(err){
				return console.error("Error in writing config.inUse.js")
			}
			console.log("Wrote configuration to '"+ pathOfConfigFileInUse +"'");
		});
	}

	var getProperty = function (name) {
		var propertyObj = JSONPath({json: configToUse, path: "$."+name})[0];
		return propertyObj;
	}

	return { "get" : getProperty }
}());

module.exports = Config;
