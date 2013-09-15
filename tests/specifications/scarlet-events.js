var g = require("../../include");
var builder = require("./builders");

var Scarlet = require("../../lib/scarlet")
var scarlet = new Scarlet();

describe("Given we are using scarlet events", function() {

	var doneEventCalled = false;
	var afterEventCalled = false;
	var beforeEventCalled = false;
	var interceptorCalled = false;
	var instance = new builder.dummies.NamedFunc();

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
			g.assert(beforeEventCalled);
		});

		it("Then the 'after' event should be called", function() {
			g.assert(afterEventCalled);
		});

		it("Then the 'done' event should be called", function() {
			g.assert(doneEventCalled);
		});

		it("Then the interceptor should be called", function() {
			g.assert(interceptorCalled);
		});

	});

});