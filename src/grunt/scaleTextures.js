/*
* @Author: BeryJu
* @Date:   2013-12-10 19:19:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 12:30:09
*/

module.exports = function (grunt) {
	this.grunt = grunt;
	this.name = "scaleTextures";
	this.description = "Scales textures for diferent settings";
	this.handler = function (paths) {
		var fs = require("fs");
		var path = require("path");
		var errors = 0;
		var rootDir = path.join(paths.game.root, paths.game.assets.shaders);
		var outDir = path.join(paths.build.root, paths.build.assets.shaders);

		var checkFile = function(path) {
			if (!fs.existsSync(path)) {
				grunt.log.error("Error compiling "+path);
				return 1;
			} else {
				return 0;
			}
		};

		// var shaders = fs.readdirSync(rootDir);
		// shaders.forEach(function (shader) {
		// 	var shaderDir = path.join(rootDir, shader);
		// 	var fragment = path.join(shaderDir, shader + ".frag");
		// 	var vertex = path.join(shaderDir, shader + ".vert");
		// 	var meta = path.join(shaderDir, shader + ".meta.json");

		// 	errors += checkFile(fragment);
		// 	errors += checkFile(vertex);
		// 	errors += checkFile(meta);

		// 	var fragmentContent = fs.readFileSync(fragment).toString();
		// 	var vertexContent = fs.readFileSync(vertex).toString();
		// 	var metaContent = JSON.parse(fs.readFileSync(meta).toString());

		// 	var out = {
		// 		fragment: fragmentContent,
		// 		vertex: vertexContent,
		// 		meta: metaContent
		// 	};

		// 	fs.writeFileSync(path.join(outDir, shader+".json"), JSON.stringify(out));
		// 	grunt.log.ok("Compiled "+shader+" to "+shader+".json");
		// });
		// return (errors === 0) ? true : false;
		return true;
	};
}