var hgPaths = [
	"src/engine/*.ts",
	"src/engine/**/*.ts",
	"src/engine/**/**/*.ts"
];

// var sourceRules = [
// 	// Replaces '//a' with '// a'
// 	{ match: new RegExp('(\:{0})//([a-bA-Z]{1})'), replace: "// $&" },
// 	// Replaces '){' with ') {'
// 	{ match: new RegExp('\\)\{'), replace: ") {" }
// ];

var hgRef = "src/engine/HG.ref.ts";

var libs = [
	"src/lib/*.d.ts"
];

var testPaths = [
	"tests/*.js",
	"tests/**/*.js"
];

var gamePaths = [
	"HorribleGame/*.ts"
];

var dist = "dist/";
var outHG = "bin/lib/hg.js";
var hgDef = "bin/lib/hg.d.ts";
var outGame = "bin/game/game.js"

var fs = require("fs");
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
					sourcemap: false
				}
			}
		},
		nodeunit: {
			hg: testPaths
		},
		nodewebkit: {
			hg: {
				options: {
					build_dir: dist,
					mac: true,
					win: true,
					linux32: true,
					linux64: true,
					version: "0.8.0"
				},
				src: 'bin/'
			}
		},
		yuidoc: {
			hg: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					extension: "ts",
					paths: ["src/engine"],
					outdir: 'docs/'
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.registerTask("game", ["tslint:game", "ts:game"]);
	grunt.registerTask("hg", ["tslint:hg", "ts:hg", "nodeunit:hg"]);
	grunt.registerTask("docs", "ts:hg", "yuidoc");
	grunt.registerTask("build", ["tslint", "ts"]);
	grunt.registerTask("test", ["nodeunit"]);
	grunt.registerTask("dist", ["tslint", "ts", "nodewebkit"]);
	grunt.registerTask("default", ["tslint:hg", "ts", "nodeunit"]);
	grunt.registerTask("all", ["tslint", "ts", "nodeunit", "nodewebkit"]);
};