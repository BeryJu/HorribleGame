/* 
* @Author: BeryJu
* @Date:   2013-11-18 19:57:17
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 13:37:55
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
	var HG = require("../bin/lib/hg.js")({
		silent: true
	});

	var disp = new HG.EventDispatcher();
	disp.eventsAvailable = ["event1", "event2"];
	disp.on("event1", function() {
		test.ok(true);
	});
	disp.on("event2", function(a, b) {
		test.ok(a === "foo" && b === "event2");
		test.done();
	});
	
	disp.dispatch("event1");
	disp.dispatch("event2", "foo");

};