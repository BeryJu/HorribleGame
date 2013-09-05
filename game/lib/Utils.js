Array.prototype.each = Array.prototype.forEach;
var Utils = {
	RGBToHex: function(input, prefix) {
		if (!input) return false;
		if (!(input instanceof Array)) input = [input];
		if (input.length < 3) {
			for (var i = 0; i < 2; i++) {
				input.push(input[0]);
			}
		}
		var Hex = prefix || "0x";
		input.each(function(c) {
			var h = parseInt(c, 0).toString(16);
			if (h.length < 2)
				Hex += "0"+h;
			else
				Hex += h;
		});
		return Hex;
	}
};