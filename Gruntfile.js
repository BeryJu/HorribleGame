var hgPaths = [
	"src/engine/*.ts",
	"src/engine/**/*.ts",
	"src/engine/**/**/*.ts"
];

var hgRef = "src/engine/HG.ref.ts";

var libs = [
	"src/lib/*.d.ts"
];

var testPaths = [
	"tests/*.js",
	"tests/**/*.js"
];

var gamePaths = [
	"bin/lib/hg.d.ts",
	"game/*.ts"
];

var dist = "dist/app.nw";
var outHG = "bin/lib/hg.js"
var outGame = "bin/game/game.js"

var fs = require("fs");
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ts: {
			hg: {
				src: libs.concat(hgPaths),
				reference: hgRef,
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
				src: libs.concat(gamePaths),
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
		},
		compress: {
			hg: {
				options: {
					archive: dist,
					mode: 'zip'
				},
				files: [
					{
						cwd: 'bin/',
						expand: true,
						src: '**'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask("game", ["ts:game"]);
	grunt.registerTask("hg", ["ts:hg"]);

	grunt.registerTask("build", ["ts"]);
	grunt.registerTask("test", ["nodeunit"]);

	grunt.registerTask("default", ["ts:hg", "nodeunit"]);
	grunt.registerTask("all", ["ts", "nodeunit", "compress"]);
};