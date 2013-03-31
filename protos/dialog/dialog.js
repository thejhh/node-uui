/* Prototype UUI application */

/* Parse widget arguments */
function _parseArguments(args) {
	// Arguments may be (in any order):

	// The label of the widget as a string, like: "Sample Dialog"
	
	// Array of child members for the widget, like: [Field('Username'), Field('email')]
	
	// Widget object that's derived from Widget (like Dialog, Field, etc): will be added as child.
	
	// Object with additional configuration settings for the widget
	
	// The builder function of the widget, like: function(w) { w.label("Sample Dialog"); return [child_a, child_b]; }

	// Returns an object with presentation of the arguments
}

/** Widget base class */
function Widget() {
};

/* Generic implementation of a dialog widget, derived from Widget */
function Dialog() {
	var args = _parseArguments(arguments);
};

/* Implementation of a shell for widget(s) in standard text console */
function TerminalShell() {

}

/* Start one or more widget(s) using the standard console terminal prompt
 * @params One or more widget objects or arrays of them
 * @returns Promise with all data from possible submits.
 */
TerminalShell.prototype.start = function() {
	var args = _parseArguments(arguments);
	
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
shell.start(login).then(function(data) {
	console.log("User " + data.username + " logging in with password " + data.password);
});

/* */
