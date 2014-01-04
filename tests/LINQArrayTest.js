/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 02:15:03
*/

var hgLoader = require("./TestHelper.js");

exports.linqArrayTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var exampleData = require("./testFiles/exampleJsonA.json");
	var queryResult = exampleData
		.where(function (x) { return x.user.id < 200 })
		.select(function (x) { return x.user.screen_name + ":" + x.text });
	var correct = ["d_linq:to objects", "c_bill:g", "b_mskk:kabushiki kaisha"];
	test.deepEqual(queryResult, correct);
	test.done();
};
