/*
* @Author: BeryJu
* @Date:   2013-12-02 20:04:13
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 20:28:08
*/

module.exports = function(fn) {
	var vm = require("vm");
	var fs = require("fs");
	var execute = function(path, context) {
		var data = fs.readFileSync(path);
		vm.runInThisContext(data, path);
	}
	execute("bin/lib/three.js");
	var HG = require("../bin/lib/hg.js").horrible({
		silent: true
	});
	return HG;
}