/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 11:55:44
*/

var hgLoader = require("./TestHelper.js");

exports.noiseTest = function(test) {
	test.expect(2);
	var HG = hgLoader();
	var noiseA = HG.Utils.Noise.generate2(2, 5);
	var noiesB = HG.Utils.Noise.generate3(2, 5, 2);
	test.strictEqual(noiseA, 0.4669041697135924);
	test.strictEqual(noiesB, 1.8417267710901796e-15);
	test.done();
};
