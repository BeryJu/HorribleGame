var mainFile = "src/*.ts";
var outFile = "dist/game.js";
var pkgFile = "dist/package.json";
var libDefinitionDir = "src/lib/*";
var mainDir = "src/engine/*.ts";
var contentDir = "src/content/*.ts";
var extensionsDir = "src/engine/**/*.hg.ts";

var fs = require('fs');
module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			hg: {
				src: [libDefinitionDir, mainDir, extensionsDir, contentDir, mainFile],
				out: outFile,
				options: {
					target: 'es5',
					comments: true,
					sourcemap: true,
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
	grunt.registerTask('publish', ['ts', 'shell']);
	// if (!fs) fs = require('fs');
	// var pkg = require("./"+pkgFile);
	// if (!pkg.build) pkg.build = 0;
	// pkg.build ++;
	// fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, "\t"));
	// console.log("HorribleGame build"+pkg.build);
};