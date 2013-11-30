var hgPaths = [
	"src/engine/*.ts",
	"src/engine/**/*.ts",
	"src/engine/**/**/*.ts"
];

var sourceRules = [
	// Replaces '//a' with '// a'
	{ match: new RegExp('//([a-bA-Z]{1})'), replace: "// $&" },
	// Replaces '){' with ') {'
	{ match: new RegExp('\\)\{'), replace: ") {" }
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
		format: {
			hg: {
				src: hgPaths,
				rules: sourceRules
			},
			game: {
				src: gamePaths,
				rules: sourceRules
			}
		},
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
	grunt.loadNpmTasks('grunt-format');
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask("game", ["format", "ts:game"]);
	grunt.registerTask("hg", ["format:hg", "ts:hg"]);

	grunt.registerTask("build", ["format", "ts"]);
	grunt.registerTask("test", ["nodeunit"]);

	grunt.registerTask("default", ["format", "ts:hg", "nodeunit"]);
	grunt.registerTask("all", ["format", "ts", "nodeunit", "compress"]);
};