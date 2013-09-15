var g = require("../../include");
var builder = require("./builders");

var Scarlet = require("../../lib/scarlet")
var scarlet = new Scarlet();

describe("Given we are intercepting", function() {

	var methodWasCalled = false;

	function interceptor(proceed, invocation) {
		methodWasCalled = true;
		return proceed();
	};

	beforeEach(function() {
		methodWasCalled = false;
	});

	describe("When we have an unnamed function instance", function() {

		var instance = new builder.dummies.UnnamedFunc();

		scarlet
			.intercept(instance)
			.using(interceptor);

		it("Then should be able to intercept the property getter", function() {
			var result = instance.property;
			g.assert(methodWasCalled);
		});

		it("Then should be able to intercept method", function() {
			instance.method();
			g.assert(methodWasCalled);
		});

		it("Then should be able to intercept method with return value", function() {
			var result = instance.methodWithReturn();
			g.assert(methodWasCalled);
			g.assert(result);
		});

		it("Then should be able to get the intercepted method as a string", function() {
			var unInterceptedInstance = new builder.dummies.UnnamedFunc();
			var actualToString = instance.method.toString();
			var expectedToString = unInterceptedInstance.method.toString();
			g.assert(actualToString === expectedToString);
		});

	});

	describe("When we have an unnamed function type", function() {

		var InterUnnamedFunction = 
			scarlet
				.intercept(builder.dummies.UnnamedFunc)
				.using(interceptor)
				.resolve();

		var instance = new InterUnnamedFunction();

		it("Then should be able to intercept the constructor", function() {
			var constructorInstance = new InterUnnamedFunction();
			g.assert(methodWasCalled);
		});

		it("Then should be able to intercept the property getter", function() {
			var result = instance.property;
			g.assert(methodWasCalled);
		});

		it("Then should be able to intercept method", function() {
			instance.method();
			g.assert(methodWasCalled);
		});

		it("Then should be able to intercept method with return value", function() {
			var result = instance.methodWithReturn();
			g.assert(methodWasCalled);
			g.assert(result);
		});
		
		it("Then should be able to get intercepted method as a string", function() {
			var expectedToString = builder.dummies.UnnamedFunc.toString();
			var interceptedToString = InterUnnamedFunction.toString();
			g.assert(expectedToString === interceptedToString);
		});
	});

});