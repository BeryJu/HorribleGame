/*
* @Author: BeryJu
* @Date:   2013-11-18 19:57:17
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-01 03:30:25
*/
exports.eventDispatcherTest = function (test) {
	test.expect(3);
	var hgLoader = require("./TestHelper.js");
	var HG = hgLoader();
	var loader = new HG.Resource.Loader("bin/assets/");
	var disp = new HG.Core.EventDispatcher(['event1', 'event2']);
	disp.on("event1", function () {
		test.ok(true);
	});
	disp.on("event2", function (a, b) {
		test.strictEqual(a, "foo");
		test.strictEqual(b, "event2");
		test.done();
	});
	disp.dispatch("event1");
	disp.dispatch("event2", "foo");
};
