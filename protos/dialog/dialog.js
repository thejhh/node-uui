/* Prototype UUI application */

/* Generic implementation of a dialog widget */
function Dialog(label, fn) {

};

/* Generic presentation of a dialog in an app */
var dialog = Dialog('Sample dialog', function(w) {
	return [Field('Username'), Field('Password', {'private': true})];
});

/* Implementation of a dialog in console */

/* */
