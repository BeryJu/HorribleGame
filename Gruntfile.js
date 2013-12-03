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
	"game/*.ts"
];

var dist = "dist/app.nw";
var outHG = "bin/lib/hg.js";
var hgDef = "bin/lib/hg.d.ts";
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
		tslint: {
			options: {
				configuration: grunt.file.readJSON("tslint.json")
			},
			hg: {
				src: hgPaths
			},
			game: {
				src: gamePaths
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
				src: libs.concat(hgDef, gamePaths),
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
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-format');
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask("game", ["format:game", "tslint:game", "ts:game"]);
	grunt.registerTask("hg", ["format:hg", "tslint:hg", "ts:hg"]);

	grunt.registerTask("build", ["format", "tslint", "ts"]);
	grunt.registerTask("test", ["nodeunit"]);
	grunt.registerTask("dist", ["format", "tslint", "ts", "compress"]);
	grunt.registerTask("default", ["format:hg", "tslint:hg", "ts:hg", "nodeunit"]);
	grunt.registerTask("all", ["format", "tslint", "ts", "nodeunit", "compress"]);
};