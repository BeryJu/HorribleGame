/* 
* @Author: BeryJu
* @Date:   2013-11-18 19:57:17
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:42:16
*/
var vm = require("vm");
var fs = require("fs");

exports.eventDispatcherTest = function(test) {
	test.expect(2);
	var execute = function(path, context) {
		var data = fs.readFileSync(path);
		vm.runInThisContext(data, path);
	}
	execute("bin/lib/three.js");
	execute("bin/lib/hg.js");
	HG.SILENT = true;
	HG.horrible();

	var disp = new HG.EventDispatcher();
	disp.eventsAvailable = ["event1", "event2"];
	disp.on("event1", function() {
		test.ok(true);
	});
	disp.on("event2", function(a, b) {
		test.ok(a === "foo" && b === "event2");
	});
	
	disp.dispatch("event1");
	disp.dispatch("event2", "foo");

	test.done();
};