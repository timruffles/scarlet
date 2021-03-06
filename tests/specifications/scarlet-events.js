require("../../include");

var scarlet = new(require("../../lib/scarlet"))();

var ObjectLiteral = require("./dummies/object-literal");
var NamedFunction = require("./dummies/named-function");
var UnnamedFunction = require("./dummies/unnamed-function");
var PrototypeFunction = require("./dummies/prototype-function");

describe("Given we are using scarlet events", function() {

	var doneEventCalled = false;
	var afterEventCalled = false;
	var beforeEventCalled = false;
	var interceptorCalled = false;
	var instance = new NamedFunction();

	function interceptor(proceed, invocation) {
		interceptorCalled = true;
		return proceed();
	};

	scarlet
		.intercept(instance)
		.using(interceptor)
		.on("before", function(invocation) {
			beforeEventCalled = true;
		}).on("after", function(invocation) {
			afterEventCalled = true;
		}).on("done", function(invocation) {
			doneEventCalled = true;
		});

	describe("When subcribing to events", function() {

		var result = instance.method();

		it("Then the 'before' event should be called", function() {
			assert(beforeEventCalled);
		});

		it("Then the 'after' event should be called", function() {
			assert(afterEventCalled);
		});

		it("Then the 'done' event should be called", function() {
			assert(doneEventCalled);
		});

		it("Then the interceptor should be called", function() {
			assert(interceptorCalled);
		});

	});

});