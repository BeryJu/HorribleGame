/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 15:45:29
*/

var hgLoader = require("./TestHelper.js");

exports.linqStringTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var template = "${0} is ";
	var linqd = template.f("a");
	test.strictEqual(linqd, "a is ");
	test.done();
};
