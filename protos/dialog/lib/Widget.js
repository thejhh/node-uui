/* Prototype UUI application */

var Q = require("q");
var util = require("util");
var events = require("events");

/** Widget base class */
function Widget() {
	var self = this;
	events.EventEmitter.call(self);
	self._members = [];
	self._defer = undefined;
}

util.inherits(Widget, events.EventEmitter);

/** Set or get widget id */
Widget.prototype.id = function(id) {
	var self = this;
	if(id !== undefined) {
		self._id = id;
		self.emit('changed', self);
		self.emit('id:changed', self);
	}
	if(self._id === undefined) {
		self._id = self.label().replace(/[^a-z0-9_]/g, "_");
	}
	return self._id;
};

/** Set or get widget label */
Widget.prototype.label = function(label) {
	var self = this;
	if(label !== undefined) {
		self._label = label;
		self.emit('changed', self);
		self.emit('label:changed', self);
	}
	return self._label;
};

/** Add a new child object */
Widget.prototype.push = function() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	self._members.push.apply(self._members, args);
};

/** Start the widget
 * @returns Promise for the widget
 */
Widget.prototype.start = function() {
	var self = this;
	if(self._defer === undefined) {
		self._defer = Q.defer();
		self.emit('started', self);
	}
	return self._defer.promise;
};

/** Start the widget
 * @returns Promise for the widget
 */
Widget.prototype.stop = function(data) {
	var self = this;
	var p = self.start();
	self._defer.resolve(data);
	self.emit('stopped', self);
	return p;
};

/* Parse widget arguments */
Widget._smart_widget_creator = function(obj, args) {
	// Arguments may be (in any order):
	args.forEach(function(arg) {
		
		// The ID of the widget as a string, like "#tag"
		if( (typeof arg === 'string') && (arg[0] === '#') ) {
			obj.id( arg.substr(1).trim() );

		// The label of the widget as a string, like: "Sample Dialog"
		} else if(typeof arg === 'string') {
			obj.label( arg.trim() );
			
		// Widget object that's derived from Widget (like Dialog, Field, etc): will be added as child.
		} else if( (typeof arg === 'object') && (arg instanceof Widget) ) {
			obj.push( arg );

		// Array of child members for the widget, like: [Field('Username'), Field('email')]
		} else if( (typeof arg === 'object') && (arg instanceof Array) ) {
			obj.push.apply(obj, arg);
			
		// Object with additional configuration settings for the widget
		} else if(typeof arg === 'object') {
			Object.keys(arg).forEach(function(key) {
				if(key === 'members') {
					obj.push.apply(obj, arg[key]);
				} else {
					obj[key] = arg[key];
				}
			});

		// The builder function of the widget, like: function(w) { w.label("Sample Dialog"); return [child_a, child_b]; }
		} else if( arg && (typeof arg === 'function') ) {
			Widget._smart_widget_creator(obj, arg(obj));
		} else {
			throw new TypeError("Argument unknown type (" + arg + ")");
		}

	});

	// Returns an object
	return obj;
};

// Export module
module.exports = Widget;

/* EOF */
