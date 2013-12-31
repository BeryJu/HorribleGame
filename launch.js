/*
* @Author: BeryJu
* @Date:   2013-12-31 16:28:46
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-31 16:49:04
*/

var urls = {
	linux32: "https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v0.8.4-linux-ia32.tar.gz",
	linux64: "https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v0.8.4-linux-x64.tar.gz",
	win: "https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v0.8.4-win-ia32.zip",
	darwin: "https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v0.8.4-osx-ia32.zip"
};

var os = require("os");
var http = require('http');
var fs = require('fs');
var path = require("path");

var platform = os.platform();
var arch = os.arch();

var download = function(url, dest, cb) {
	var start = new Date().getTime();
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			file.close();
			var end = new Date().getTime();
			cb(new Date(end - start));
		});
	});
}

var downloadUrl;
var targetDir = platform + "-" + arch;

if (platform === "win32") {
	downloadUrl = urls.win;;
} else if (platform === "linux") {
	if (arch === "x64") {
		downloadUrl = urls.linux64;
	} else {
		downloadUrl = urls.linux32;
	}
} else if (platform === "darwin") {
	downloadUrl = urls.darwin;
} else {
	console.error("Unknown Platform");
	process.exit(1);
}
var dest = path.join("./", "nw", "temp", targetDir);

console.log("Downloading Node-Webit for "+targetDir);

download(downloadUrl, dest, function () {
	if (platform.indexOf("linux") !== -1) {
		//is linux

	} else {
		//is osx or win
	}
});