/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 18:21:28
*/

var hgLoader = require("./TestHelper.js");

exports.queueTest = function(test) {
	test.expect(1);
	var HG = hgLoader();
	var queue = new HG.Core.Hash();
	for (var i = 0; i < 4; i++) {
		queue.push("foo", function(next) {
			next("foo");
		});
	}
	HG.Utils.queue(queue, function() {
		test.ok(true);
		test.done();
	});
};
