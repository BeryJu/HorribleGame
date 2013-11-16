var paths = [
	"src/lib/*.d.ts",
	"src/engine/*.ts",
	"src/engine/**/*.ts",
	"src/engine/**/**/*.ts"
];

var gameFiles = [
	"src/lib/*.d.ts",
	"dist/lib/hg.d.ts",
	"src/*.ts"
];
var outHG = "dist/lib/hg.js"
var outGame = "dist/game.js"

var fs = require('fs');
module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			hg: {
				src: paths,
				out: outHG,
				options: {
					target: 'es5',
					comments: true,
					sourcemap: true,
					declaration: true,
					fullSourceMapPath: true
				}
			},
			game: {
				src: gameFiles,
				out: outGame,
				options: {
					target: 'es5',
					comments: true,
					sourcemap: true,
					declaration: true,
					fullSourceMapPath: true
				}
			}
		},
		shell: {
			hg: {
				command: "rm tscommand.tmp.txt ; cd dist/ ; zip -r dist.nw . ; mv dist.nw ../bin ; cp ../bin/dist.nw /srvroot/documentRoot/stuff/HorribleGame/"
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-shell');
	grunt.registerTask('default', ['ts']);
	grunt.registerTask('game', ['ts:game']);
	grunt.registerTask('hg', ['ts:hg']);
	grunt.registerTask('publish', ['ts', 'shell']);
};