/* Prototype UUI application */

var Q = require("q");
var util = require("util");
var events = require("events");
var Widget = require("./Widget.js");

/** Shell base class */
function Shell() {
	var self = this;
	events.EventEmitter.call(self);
	self._widgets = []; // All started widgets
}

util.inherits(Shell, events.EventEmitter);

/* Start one widget in the shell
 * @params w Widget object to start
 * @returns Promise for widget
 */
Shell.prototype._start = function(w) {
	var self = this;
	return Q.fcall(function() {
		if(!(w instanceof Widget)) {
			throw new TypeError(".start called with non Widget argument!");
		}
		self._widgets.push(w);
		self.emit('started', w);
		self.emit('Widget:started', w);
		return w.start();
	});
};

/* Start one or more widget(s) in the shell
 * @params One or more widget objects or arrays of them
 * @returns Promise for all widgets
 */
Shell.prototype.start = function() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	return Q.fcall(function() {

		var widgets = [];
		args.forEach(function(arg) {
			if(arg && (arg instanceof Widget)) {
				widgets.push(arg);
			} else if(arg && (arg instanceof Array)) {
				arg.forEach(function(w) {
					if(w && (w instanceof Widget)) {
						widgets.push(w);
					} else {
						throw new TypeError("Wrong type for widget inside an array (" + w + ")");
					}
				});
			} else {
				throw new TypeError("Argument unknown type (" + arg + ")");
			}
		}); // args.forEach
		
		var promises = [];
		widgets.forEach(function(w) {
			promises.push( self._start(w) );
		});

		return Q.allResolved(promises).then(function(promises) {
			var values = [];
			var errors = [];
			promises.forEach(function (promise) {
				if (promise.isFulfilled()) {
					values.push(promise.valueOf());
				} else {
					errors.push(promise.valueOf().exception);
				}
			});
			if( (values.length === 1) && (errors.length === 0) ) {
				return values.shift();
			} else {
				return {'values':values, 'errors':errors};
			}
		});
		
	}); // Q.fcall
}; // Shell.prototype.start

// Export module
module.exports = Shell;

/* EOF */
