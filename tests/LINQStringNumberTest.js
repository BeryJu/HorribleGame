/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 17:09:28
*/

var hgLoader = require("./TestHelper.js");

exports.linqStringArrayTest = function(test) {
	test.expect(2);
	var HG = hgLoader();
	var templateA = "${0} is ${1} and ${2} isn't ${3}";
	var linqdA = templateA.f(0, 1, 2, 3);
	var templateB = "${0}";
	var linqdB = templateB.f(0);
	test.strictEqual(linqdA, "0 is 1 and 2 isn't 3");
	test.strictEqual(linqdB, "0");
	test.done();
};
