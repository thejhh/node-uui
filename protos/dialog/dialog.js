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
	}
	return self._id;
};

/** Set or get widget label */
Widget.prototype.label = function(label) {
	var self = this;
	if(label !== undefined) {
		self._label = label;
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
		return Q.allResolved(promises);
		
	}); // Q.fcall
}; // Shell.prototype.start

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
		} else {
			throw new TypeError("Argument unknown type (" + arg + ")");
		}

	});

	// Returns an object
	return obj;
}

/* Generic implementation of a dialog widget, derived from Widget */
function Dialog() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	if(!(self instanceof Dialog)) {
		return Dialog.create.apply(Dialog, args);
	} else {
		Widget.call(self);
	}
}

util.inherits(Dialog, Widget);

/** Create object using smart widget creator */
Dialog.create = function() {
	var args = Array.prototype.slice.call(arguments);
	var obj = new Dialog();
	_smart_widget_creator(obj, args);
	return obj;
};

/* Generic implementation of a field widget, derived from Widget */
function Field() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	if(!(self instanceof Field)) {
		return Field.create.apply(Field, args);
	} else {
		Widget.call(self);
	}
}

util.inherits(Field, Widget);

/** Create object using smart widget creator */
Field.create = function() {
	var args = Array.prototype.slice.call(arguments);
	var obj = new Field();
	_smart_widget_creator(obj, args);
	return obj;
};

/* Implementation of a shell for widget(s) in standard text console */
function TerminalShell() {
	var self = this;
	var args = Array.prototype.slice.call(arguments);
	if(!(self instanceof TerminalShell)) {
		return TerminalShell.create.apply(TerminalShell, args);
	} else {
		Shell.call(self);
	}
}

util.inherits(TerminalShell, Shell);

/** Create object using smart widget creator */
TerminalShell.create = function() {
	var args = Array.prototype.slice.call(arguments);
	var obj = new TerminalShell();
	//_smart_widget_creator(obj, args);

	var readline = require('readline');
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	rl.question('What is your favorite food?', function(answer) {
		console.log('Oh, so your favorite food is ' + answer);
	});

	return obj;
};

/* Test code */

// Please note! These functions aren't taking positionals -- you can place the arguments in any order! So don't worry! :-)

// Our login dialog
var login = Dialog.create('#login', 'Sample login dialog', [
	Field.create('#username', 'Username'),
	Field.create('#password', 'Password', {'private':true})
]);

// Here's how we can handle the data
login.on('submit', function(data) {
	console.log("Submitted data was: " + JSON.stringify(data) );
});

// Now we will start the dialog in the terminal prompt
var errors = require('prettified').errors;
var shell = TerminalShell.create();
shell.start(login).then(function(data) {
	console.log("User " + data.username + " logging in with password " + data.password);
}).fail(function(err) {
	 errors.print(err);
}).done();

/* */
