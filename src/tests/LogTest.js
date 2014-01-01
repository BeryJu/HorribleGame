/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-27 21:33:40
*/

var hgLoader = require("./TestHelper.js");

exports.logTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var s = "\nfoo bar baz";
	test.strictEqual(HG.log(s), s);
	test.done();
};
