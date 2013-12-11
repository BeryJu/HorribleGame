/*
* @Author: BeryJu
* @Date:   2013-12-10 19:19:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-10 19:52:48
*/

module.exports = function (grunt) {
	this.grunt = grunt;
	this.name = "compileShaders";
	this.description = "Compiles Shaders for HG";
	this.handler = function () {
		var fs = require("fs");
		var path = require("path");
		var errors = 0;
		var outDir = path.join(grunt.config.data.paths.assetsRoot, "shaders/");
		var rootDir = path.join(grunt.config.data.paths.gameRoot, "shaders/");

		var success = false;
		var shaders = fs.readdirSync(rootDir);
		shaders.forEach(function (shader) {
			var shaderDir = path.join(rootDir, shader);
			var fragment = path.join(shaderDir, shader + ".fragment");
			var vertex = path.join(shaderDir, shader + ".vertex");
			if (!fs.existsSync(fragment)) {
				grunt.log.error("Error compiling "+fragment);
				errors++;
				return;
			}
			if (!fs.existsSync(vertex)) {
				grunt.log.error("Error compiling "+vertex);
				errors++;
				return;
			}

			var fragmentContent = fs.readFileSync(fragment).toString();
			var vertexContent = fs.readFileSync(vertex).toString();

			var out = {
				fragmennt: fragmentContent.split("\n"),
				vertex: vertexContent.split("\n")
			};

			fs.writeFileSync(path.join(outDir, shader+".json"), JSON.stringify(out));
			grunt.log.ok("Compiled "+shader+" to "+shader+".json");
		});
		return (errors === 0) ? true : false;
	};
}