/*
* @Author: BeryJu
* @Date:   2013-11-18 19:57:17
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 22:18:01
*/
var vm = require("vm");
var fs = require("fs");

exports.moduleLoadTest = function(test) {
	test.expect(2);
	var execute = function(path, context) {
		var data = fs.readFileSync(path);
		vm.runInThisContext(data, path);
	}
	execute("bin/lib/three.js");
	var HG = require("../bin/lib/hg.js").horrible({
		silent: true
	});
	test.ok((THREE) ? true : false, "THREE defined");
	test.ok((HG) ? true : false, "HG defined");
	test.done();
};