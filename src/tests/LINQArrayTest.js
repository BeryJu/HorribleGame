/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 11:59:12
*/

var hgLoader = require("./TestHelper.js");

exports.linqArrayTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var exampleData = [
		{ "user": { "id": 100, "screen_name": "d_linq" }, "text": "to objects" },
		{ "user": { "id": 130, "screen_name": "c_bill" }, "text": "g" },
		{ "user": { "id": 155, "screen_name": "b_mskk" }, "text": "kabushiki kaisha" },
		{ "user": { "id": 301, "screen_name": "a_xbox" }, "text": "halo reach" }
	];
	var queryResult = exampleData
		.where(function (x) { return x.user.id < 200 })
		.select(function (x) { return x.user.screen_name + ":" + x.text });
	var correct = ["d_linq:to objects", "c_bill:g", "b_mskk:kabushiki kaisha"];
	test.deepEqual(queryResult, correct);
	test.done();
};
