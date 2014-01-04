/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 11:58:13
*/

var hgLoader = require("./TestHelper.js");
exports.linqNumberTest = function(test) {
	test.expect(2);
	var HG = hgLoader();
	test.strictEqual((90).toRadian(), 1.5707963267948966);
	test.strictEqual((90).toDegrees(), 5156.620156177409);
	test.done();
};
