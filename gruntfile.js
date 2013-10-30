var mainFile = "src/*.ts";
var outFile = "dist/game.js";
var libDefinitionDir = "src/lib/*.d.ts";
var libSourceDir = "src/lib/*.js";
var mainDir = "src/engine/*.ts";
var contentDir = "src/content/*.ts";
var extensionsDir = "src/engine/**/*.hg.ts";
var pkgFile = "dist/package.json";

var fs = require('fs');
module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			game: {
				src: [libDefinitionDir, mainDir, extensionsDir, contentDir, mainFile],
				out: outFile,
				options: {
					target: 'es5',
					comments: true,
					sourcemap: false
				}
			}
		},
		uglify: {
			app: {
				files: {
					"dist/lib.js": [libSourceDir]
				}
			}
		},
		shell: {
			app: {
				command: "rm tscommand.tmp.txt ; cd dist/ ; zip -r dist.nw . ; mv dist.nw ../bin ; cp ../bin/dist.nw /var/www/stuff/HorribleGame/"
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['ts']);
	grunt.registerTask('publish', ['ts', 'uglify', 'shell']);
	// if (!fs) fs = require('fs');
	// var pkg = require("./"+pkgFile);
	// if (!pkg.build) pkg.build = 0;
	// pkg.build ++;
	// fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, "\t"));
	// console.log("HorribleGame build"+pkg.build);
};