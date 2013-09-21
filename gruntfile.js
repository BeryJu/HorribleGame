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
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks("grunt-ts");
	grunt.registerTask('default', ['ts', 'uglify']);
};