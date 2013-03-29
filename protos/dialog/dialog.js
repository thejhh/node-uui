/* Prototype UUI application */

/* Parse widget arguments */
function _parseArguments(args) {
	// Arguments may be (in any order):

	// The label of the widget as a string, like: "Sample Dialog"
	
	// Array of child members for the widget, like: [Field('Username'), Field('email')]
	
	// Object with additional configuration settings for the widget
	
	// The builder function of the widget, like: function(w) { w.label("Sample Dialog"); return [child_a, child_b]; }

	// Returns an object with presentation of the arguments
}

/* Private qualifier helper for widgets */
function isPrivate(value) {
	return function(w) {
		return {'private': (value || (value === undefined)) ? true : false};
	};
}

/* Generic implementation of a dialog widget */
function Dialog() {
	var args = _parseArguments(arguments);
};

/* Generic presentation of a dialog in an app */
var dialog = Dialog('Sample dialog', [Field('Username'), Field('Password', isPrivate())] );

/* Implementation of a dialog in console */

/* */
