module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			lib: {
				options: {
					'-W103': true
				},
				src: ['lib/*.js']
			},
			game: {
				src: ['build/Game.js']
			}
		},
		concat: {
			lib: {
				src: ['lib/*.js'],
				dest: 'build/lib.js',
			},
			game: {
				src: ['build/lib.js', 'build/Game.js'],
				dest: 'build/app.js',
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['jshint', 'concat']);
};