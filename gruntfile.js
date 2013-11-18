var sourcePaths = [
	"src/lib/*.d.ts",
	"src/engine/*.ts",
	"src/engine/**/*.ts",
	"src/engine/**/**/*.ts"
];

var testPaths = [
	"tests/*.js",
	"tests/**/*.js"
];

var gamePaths = [
	"src/lib/*.d.ts",
	"bin/lib/hg.d.ts",
	"game/*.ts"
];
var outHG = "bin/lib/hg.js"
var outGame = "bin/game.js"

var fs = require("fs");
module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			hg: {
				src: sourcePaths,
				out: outHG,
				options: {
					target: "es5",
					module: "commonjs",
					sourcemap: true,
					declaration: true,
					fullSourceMapPath: true
				}
			},
			game: {
				src: gamePaths,
				out: outGame,
				options: {
					target: "es5",
					comments: true,
					sourcemap: true,
					fullSourceMapPath: true
				}
			}
		},
		nodeunit: {
			hg: testPaths
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.registerTask("default", ["ts"]);
	grunt.registerTask("game", ["ts:game"]);
	grunt.registerTask("hg", ["ts:hg"]);
	grunt.registerTask("test", ["nodeunit"]);
	grunt.registerTask("all", ["ts", "nodeunit"]);
};