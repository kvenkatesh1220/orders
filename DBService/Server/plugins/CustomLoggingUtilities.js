
//-------------------------------------------------------------------------
//TO GET THE LINE NUMBER AND FUNCTION NAME : FOR LOGGING
//-------------------------------------------------------------------------

Object.defineProperty(global, '__stack', {
	get: function () {
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function (_, stack) {
			return stack;
		};
		//var err = new Error;	//Commenting out as per Lint suggestion but am not sure.
		var err = new Error();
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;
		return stack;
	}
});

Object.defineProperty(global, '__line', {
	get: function () {
		return __stack[1].getLineNumber();
	}
});

Object.defineProperty(global, '__function', {
	get: function () {
		return __stack[1].getFunctionName();
	}
});


//TODO : https://github.com/itadakimasu/console-plus - analyze if we can use this module
