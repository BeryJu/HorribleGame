/*
* @Author: BeryJu
* @Date:   2013-12-02 20:04:13
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-31 17:21:27
*/

module.exports = function() {
	var vm = require("vm");
	var fs = require("fs");
	var execute = function(path, context) {
		var data = fs.readFileSync(path);
		vm.runInThisContext(data, path);
	}
	execute("bin/lib/thirdparty/three.js");
	var HG = require("../bin/lib/hg.js").horrible({
		silent: true
	});
	return HG;
}