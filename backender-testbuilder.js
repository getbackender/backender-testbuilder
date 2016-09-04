require('app-module-path').addPath(__dirname);
var ls = require('list-directory-contents');
var _ = require('underscore');
function profile(func, key) {
	return function () {
		var returnVal = func.apply(this, arguments);
		var tmpTest = arguments[0];
	    tmpTest.screenshot('./report/dalek/details/' + key + '.png');
		return returnVal;
	};
}

var factory = function (stepdir, f) {
	return function (test) {
		var tests = {};
		console.log("step directory");
		console.log(stepdir);
		ls(stepdir, function (err, tree) {
		console.log("DIR TREE");
		console.log(tree);
			tree.map(function (o) {
			console.log("LOOKING INTO STEP");
		console.log('./' + o);
				var obj = require( '..\\..\\' +o)(test);
				tests = _.extend(tests, obj);
			});
			for (var key in tests) {
				if (!tests.hasOwnProperty(key)) {
					continue;
				}
				test[key] = tests[key];
			}
			f && f(test);
			test.done();
		});
	};
};

var allTrue = function (obj) {
	for (var o in obj)
		if (!obj[o])
			return false;			
	return true;
}
var runStepIfDifferentFrom = function (test, ex, testName, testArg) {
	if (!ex) {
		throw 'Please enter an exception to step :  ' + '"fill out all other parts of the redemption form correctly except"'
	}

	if (typeof ex === 'string') {
		ex = [ex];
	}

	var canRun = allTrue(ex.map(function (o) {
				return ex != testName;
			}));

		canRun && test[testName](testArg);
};
var builder={};

builder.helper={
	runStepIfDifferentFrom:runStepIfDifferentFrom
};
builder.steps=function (stepdir) {
	return function (tests) {
		var payload = {};
		for (var key in tests) {
			if (!tests.hasOwnProperty(key)) {
				continue;
			}
			payload[key] = factory(stepdir, profile(tests[key], key));
		}
		return payload;
	};
};

module.exports = builder;
