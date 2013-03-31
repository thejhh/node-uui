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

/* Implementation of a shell for widget(s) in HTML/CSS/JS */
function JQueryShell() {

}

/* Using dialogs with HTML shell and jquery */
/* Please note! These functions aren't taking positionals! :-) */
var dialog = Dialog('#login', 'Sample login dialog', [Field('#username', 'Username'), Field('#password', 'Password', {'private':true})] );

var shell = JQueryShell('#shell');
shell.render(dialog);

dialog.on('submit', function(data) {
	alert("Submitted data was: " + JSON.stringify(data) );
});

/* */
