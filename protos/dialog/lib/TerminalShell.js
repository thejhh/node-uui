/* Prototype UUI application */

var Q = require("q");
var util = require("util");
var Shell = require("./Shell.js");
var Dialog = require("./Dialog.js");
var Field = require("./Field.js");

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
	
	var queue = [];
	obj.on('Widget:started', function(w) {
		queue.push(w);
	});
	
	function do_Field(w) {
		var defer = Q.defer();
		var value = w.value();
		var q = w.label() + ( (value === undefined) ? '' : ' [' + value + ']' ) + ': ';
		if(value) {
			rl.write(value);
		}
		rl.question(q, function(answer) {
			w.value(answer);
			defer.resolve(w);
		});
		return defer.promise;
	}
	
	function do_Dialog(d) {
		console.log('+-- ' + d.label() + ' --+');
		return Q.fcall(function() {
			
			var funcs = [];
			d._members.forEach(function(w) {
				funcs.push(function() {
					if(w instanceof Field) {
						return do_Field(w);
					} else {
						return Q.fcall(function() { throw new TypeError("w is unknown type"); });
					}
				});
			});

			var result = Q.resolve();
			funcs.forEach(function (f) {
				result = result.then(f);
			});
			return result;
		}).fin(function() {
			d.submit();
			console.log('+---' + d.label().replace(/./g, "-") + "---+\n");
		});
	}
	
	function do_step() {
		return Q.fcall(function() {
			var w = queue.shift();
			if(!w) return;
			
			if(w instanceof Dialog) {
				return do_Dialog(w);
			} else if(w instanceof Field) {
				return do_Field(w);
			}

		}); // Q.fcall
	} // do_step
	
	function do_next() {
		do_step().then(function() {
			if(queue.length === 0) {
				setTimeout(function() {
					do_next();
				}, 100);
			} else {
				setImmediate(function() {
					do_next();
				});
			}
		}).fail(function(err) {
			console.error('Error: ' + err);
		}).done();
	}

	do_next();

	return obj;
};

// Export module
module.exports = TerminalShell;

/* EOF */
