/* Prototype UUI application */

var Dialog = require("./lib").Dialog;
var Field = require("./lib").Field;
var OurShell = require("./lib").shells.readline;

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
var shell = OurShell.create();
shell.start(login).then(function(data) {
	console.log("User '" + data.username + "' logging in with password '" + data.password + "'");
}).fail(function(err) {
	 errors.print(err);
}).done();

/* */
