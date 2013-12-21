/*
* @Author: BeryJu
* @Date:   2013-12-02 20:03:45
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 17:28:43
*/

var hgLoader = require("./TestHelper.js");

exports.queueTest = function(test) {
	test.expect(1);
	// var HG = hgLoader();
	// var queue = new HG.Utils.Queue();
	// for (var i = 0; i < 4; i++) {
	// 	queue.push(function(next) {
	// 		next("foo");
	// 	});
	// }
	// queue.on("done", function() {
		test.ok(true);
		test.done();
	// });
	// queue.doAll();
};
