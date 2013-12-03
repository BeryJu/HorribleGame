/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 15:37:53
*/

var hgLoader = require("./TestHelper.js");

exports.linqStringArrayTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var template = "${0} is ${1} and ${2} isn't ${3}";
	var linqd = template.f("a", "b", "c", "d");
	test.strictEqual(linqd, "a is b and c isn't d");
	test.done();
};
