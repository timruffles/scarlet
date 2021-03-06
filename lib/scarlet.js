require("../include");

var ext = require("./extensions");

/**
 * Creates a Scarlet Instance
 *
 * #### Example:
 *
 * ```javascript
 * Scarlet
 *     .intercept(someFunction)
 *     .using(someInterceptorFunction);
 * ```
 * 
 * @category Interception Methods
 * @class Scarlet
 * @constructor
 * @param {Array} pluginArr - optional array of plugins to load
**/
function Scarlet(pluginArr) {

	"use strict";

	var self = this;
	self.plugins = {};
	self.lib = require("./index");

	/**
	 * Extends the Scarlet properties onto a target object.
	 *
	 * ####Example:
	 *
	 * 
	 * ```javascript
	 * scarlet.extend(someObject);
	 * //-> someObject can now invoke and call scarlet members
	 * ```
	 * 
	 * @category Interception Methods
	 * @method extend
	 * @param {Function|Object} target the object to put the scarlet properties on
	 * @return {Function} A Scarlet interceptor object.
	**/
	self.extend = function(target){
		function addScarletMemberToTarget(member){
			target[member] = function(){
				return self[member].apply(self,arguments);
			};
		}
		for(var member in self){
			addScarletMemberToTarget(member);
		}
		return self;
	};

	/**
	 * Creates a Scarlet interceptor. All Scarlet interceptors are instances of EventEmitter.
	 *
	 * ####Example:
	 *
	 * Basic interceptor
	 * ```javascript
	 * Scarlet.intercept(someFunction);
	 * ```
	 * 
	 * interceptor with events
	 * ```javascript
	 * Scarlet.intercept(someFunction)
	 *        .on('before', beforeFunction)
	 *        .on('after', afterFunction)
	 *        .on('done', doneFunction);
	 * ```
	 * 
	 * @category Interception Methods
	 * @method intercept
	 * @param {Function|Object} typeOrInstance the type or instance to be intercepted
	 * @return {Function} A Scarlet interceptor object.
	**/
	self.intercept = function(typeOrInstance, memberName) {
		assert(typeOrInstance, "Cannot have null type or instance");
		assert(typeof(typeOrInstance.__scarlet) === "undefined", "Type or instance already contains a scarlet interceptor");
		var self = this;
		var _interceptor = new self.lib.Interceptor(typeOrInstance);
		if(memberName){
			if(ext.object.hasMember(typeOrInstance,memberName))
				return _interceptor.forMember(memberName);
			throw new Error("Intercepted Object Doesn't have method/property specfied:" + memberName);
		}
		if (typeOrInstance.prototype)
			return  _interceptor.forType();		
		return _interceptor.forObject();
	};

	/**
	 * loads a plugin
	 *
	 * #### Example:
	 *
	 * ```javascript
	 * Scarlet.loadPlugin(someScarletPlugin);
	 * ```
	 * 
	 * @category Interception Methods
	 * @method loadPlugin
	 * @param {Function|Object} pluginPath the plugin to be loaded
	 * @return {Function} A reference to scarlet(self)
	 * @chainable
	**/
	self.loadPlugin = function(pluginPath) {
		self.lib.Plugins.loadPlugin(self, pluginPath);
		return self;
	};

	if(typeof pluginArr === 'string')
		pluginArr = [pluginArr];

	if(pluginArr){
		if (pluginArr.length) {
			pluginArr.forEach(function(plugin){
				self.loadPlugin(plugin);
			});
		}		
	}

}

module.exports = Scarlet;
