/*
* @Author: BeryJu
* @Date:   2013-11-18 19:57:17
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 20:10:09
*/

var hgLoader = require("./TestHelper.js");
exports.moduleLoadTest = function(test) {
	test.expect(2);
	var HG = hgLoader();
	test.ok((THREE) ? true : false, "THREE defined");
	test.ok((HG) ? true : false, "HG defined");
	test.done();
};