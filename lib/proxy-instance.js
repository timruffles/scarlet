require("../include");

var ProxyMember = require("./proxy-member");
var enumerable = require("./extensions/enumerable");

function ProxyInstance(instance) {

	"use strict";

	var self = this;

	self.instance = instance;

	self.whenCalled = function(target) {
		if (!instance.__scarlet) {
			instance.__scarlet = {};
			enumerable.forEach(instance, function(member, memberName) {
				if (memberName === "__scarlet")
					return;
				var proxy = new ProxyMember(instance, memberName);
				proxy.whenCalled(target);
			});
		}
		return instance;
	};

	self.unwrap = function() {
		if (instance.__scarlet) {
			enumerable.forEach(instance, function(member, memberName) {
				if (member instanceof Function) {
					var originalMethod = instance.__scarlet[memberName];
					instance[memberName] = originalMethod;
				}
			});
		}
	};
}

module.exports = ProxyInstance;