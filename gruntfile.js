var mainFile = "src/Game.ts";
var outFile = "dist/game.js";
var outLibFile = "dist/lib.js";
var libDefinitionDir = "src/lib/*.d.ts";
var libSourceDir = "src/lib/*.js";
var mainDir = "src/framework/*.ts";
var extensionsDir = "src/framework/**/*.hg.ts";
var pkgFile = "dist/package.json";

var fs = require('fs');
module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			game: {
				src: [libDefinitionDir, mainDir, extensionsDir, mainFile],
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
					outLibFile: [libSourceDir]
				}
			}
		},
		shell: {
			app: {
				options: {
					stdout: true
				},
				command: "cd /var/www/stuff/HorribleGame && rm -r * && cd /var/www/dev/projects/HorribleGame/dist/ && cp -R * /var/www/stuff/HorribleGame && cd /var/www/stuff/HorribleGame && echo \"Published to /var/www/stuff/HorribleGame/\""
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['ts']);
	grunt.registerTask('publish', ['ts', 'uglify', 'shell']);
	if (!fs) fs = require('fs');
	var pkg = require("./"+pkgFile);
	if (!pkg.build) pkg.build = 0;
	pkg.build ++;
	fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, "\t"));
	console.log("HorribleGame build"+pkg.build);
};