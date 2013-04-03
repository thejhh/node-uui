/* Prototype UUI application */

var util = require("util");
var events = require("events");

/** Widget base class */
function Widget() {
	events.EventEmitter.call(this);
	this._members = [];
}

util.inherits(Widget, events.EventEmitter);

/** Set or get widget id */
Widget.prototype.id = function(id) {
	if(id !== undefined) this._id = id;
	return this._id;
}

/** Set or get widget label */
Widget.prototype.label = function(label) {
	if(label !== undefined) this._label = label;
	return this._label;
}

/** Add a new child object */
Widget.prototype.push = function() {
	var args = Array.prototype.slice.call(arguments);
	this._members.push.apply(this._members, args);
}

/** Shell base class */
function Shell() {
	events.EventEmitter.call(this);
	this._members = [];
}

util.inherits(Shell, events.EventEmitter);

/* Parse widget arguments */
function _smart_widget_creator(obj, args) {
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
			_smart_widget_creator(obj, arg(obj));
		}

	});

	// Returns an object
	return obj;
}

/* Generic implementation of a dialog widget, derived from Widget */
function Dialog() {
	var args = Array.prototype.slice.call(arguments);
	Widget.call(this);
	_smart_widget_creator(this, args);
};

util.inherits(Dialog, Widget);

/* Generic implementation of a field widget, derived from Widget */
function Field() {
	var args = Array.prototype.slice.call(arguments);
	Widget.call(this);
	_smart_widget_creator(this, args);
};

util.inherits(Field, Widget);

/* Implementation of a shell for widget(s) in standard text console */
function TerminalShell() {
	var args = Array.prototype.slice.call(arguments);
	Shell.call(this);
	//_smart_widget_creator(this, args);
}

util.inherits(TerminalShell, Shell);

/* Start one or more widget(s) using the standard console terminal prompt
 * @params One or more widget objects or arrays of them
 * @returns Promise with all data from possible submits.
 */
TerminalShell.prototype.run = function() {
	//var args = Array.prototype.slice.call(arguments);
	//_smart_widget_creator(this, args);
};

/* Test code */

// Please note! These functions aren't taking positionals -- you can place the arguments in any order! So don't worry! :-)

// Our login dialog
var login = Dialog('#login', 'Sample login dialog', [
	Field('#username', 'Username'),
	Field('#password', 'Password', {'private':true})
]);

// Here's how we can handle the data
login.on('submit', function(data) {
	console.log("Submitted data was: " + JSON.stringify(data) );
});

// Now we will start the dialog in the terminal prompt
var shell = TerminalShell();
shell.run(login).then(function(data) {
	console.log("User " + data.username + " logging in with password " + data.password);
});

/* */
