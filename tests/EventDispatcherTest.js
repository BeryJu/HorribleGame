/*
* @Author: BeryJu
* @Date:   2013-11-18 19:57:17
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 21:20:24
*/
var hgLoader = require("./TestHelper.js");
exports.eventDispatcherTest = function (test) {
	test.expect(3);
	var HG = hgLoader();
	var loader = new HG.Resource.ResourceLoader("bin/assets/");
	loader.locale("locale/HG.locale.json", function (locale) {
		HG.locale = locale;
	});
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
