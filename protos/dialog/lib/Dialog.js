/* Prototype UUI application */

var util = require("util");
var Widget = require("./Widget.js");

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
	Widget._smart_widget_creator(obj, args);
	return obj;
};

/** Submit the widget
 * @returns Promise for the widget
 */
Dialog.prototype.submit = function() {
	var self = this;
	var data = {};
		self._members.forEach(function(w) {
			var id = w.id();
			while(data[id] !== undefined) {
				id += '_';
			}
			data[id] = w.value();
	});
	return self.stop(data);
};

// Export module
module.exports = Dialog;

/* EOF */
