module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ts: {
			game: {
				src: ['src/framework/lib/*.d.ts', 'src/framework/*.ts', 'src/framework/**/*.hg.ts', 'src/Game.ts'],
				out: 'dist/game.js',
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
					'dist/lib.js': ['src/framework/lib/*.js']
				}
			}
		},
		shell: {
			app: {
				options: {
					stdout: true
				},
				command: "cd /var/www/stuff/HorribleGame && rm -r * && cd /var/www/dev/projects/HorribleGame/dist/ && cp -R * /var/www/stuff/HorribleGame && cd /var/www/stuff/HorribleGame && echo \"K. Done.\""
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['ts']);
	grunt.registerTask('publish', ['ts', 'uglify', 'shell']);
};