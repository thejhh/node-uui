/* Prototype UUI application */

var util = require("util");
var Widget = require("./Widget.js");

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
	Widget._smart_widget_creator(obj, args);
	return obj;
};

/** Set or get field value */
Field.prototype.value = function(value) {
	var self = this;
	if(value !== undefined) {
		self._value = value;
		self.emit('changed', self);
		self.emit('value:changed', self);
	}
	return self._value;
};

// Export module
module.exports = Field;

/* EOF */
