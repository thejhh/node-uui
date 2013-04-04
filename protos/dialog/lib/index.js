
var mod = module.exports = {};

mod.Widget = require('./Widget.js');
mod.Dialog = require('./Dialog.js');
mod.Field = require('./Field.js');
mod.Shell = require('./Shell.js');

// Available shells
mod.shells = {
	'readline' : require('./TerminalShell.js')
};

/* EOF */
