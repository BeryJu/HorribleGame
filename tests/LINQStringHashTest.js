/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 15:39:07
*/

var hgLoader = require("./TestHelper.js");

exports.linqStringHashTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var template = "${a} is ${b} and ${c} isn't ${d}";
	var linqd = template.f({
		a: "foo",
		b: "bar",
		c: "baar",
		d: "baz"
	});
	test.strictEqual(linqd, "foo is bar and baar isn't baz");
	test.done();
};
