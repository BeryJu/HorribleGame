/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 02:12:59
*/

var hgLoader = require("./TestHelper.js");

exports.queueTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var queue = new HG.Core.Queue();
	for (var i = 0; i < 4; i++) {
		queue.call("foo", function(next) {
			next("foo");
		});
	}
	queue.on("done", function () {
		test.ok(true);
		test.done();
	});
	queue.start();
};
