var fs = require("fs");
var os = require("os");
var path = require("path");

var paths = {
	meta: {
		tslint: "src/tslint.json",
		plugins: "src/grunt/"
	},
	game: {
		root: "src/HorribleGame/",
		bin: "bin/game/game.js",
		def: "bin/game/game.d.ts",
		assets: {
			shaders: "shaders/",
			textures: "textures/",
			models: "models"
		},
		source: [
			"src/HorribleGame/*.ts"
		]
	},
	jade: {
		root: "src/jade/"
	},
	build: {
		root: "bin/",
		assets: {
			shaders: "assets/shaders/",
			scenes: "assets/scenes/",
			models: "assets/models/"
		},
	},
	hg: {
		ref: "src/HG/HG.ref.ts",
		bin: "bin/lib/hg.js",
		def: "bin/lib/hg.d.ts",
		source: [
			"src/HG/*.ts",
			"src/HG/**/*.ts",
			"src/HG/**/**/*.ts"
		]
	},
	libs: "src/lib/*.d.ts",
	dist: {
		root: "dist/"
	},
	test: {
		source: [
			"tests/*.js",
			"tests/**/*.js"
		]
	}
};

var createPathObject = function (root, out, extFrom, extTo) {
	var files = fs.readdirSync(root);
	var object = {};
	files.forEach(function (file) {
		var srcFile = path.join(root, file);
		var outFile = path.join(out, file.replace(extFrom, extTo));
		object[outFile] = srcFile;
	});
	return object;
};
var config = {
	paths: paths,
	jade: {
		hg: {
			options: {
				pretty: true,
				data: {
					title: "HorribleGame",
					liveReload: "http://"+os.hostname()+":35729/livereload.js"
				}
			},
			files: createPathObject(paths.jade.root, paths.build.root, ".jade", ".html")
		}
	},
	tslint: {
		options: {
			configuration: require("./"+paths.meta.tslint)
		},
		hg: {
			src: paths.hg.source
		},
		game: {
			src: paths.game.source
		}
	},
	ts: {
		hg: {
			src: [ paths.libs ].concat(paths.hg.source),
			reference: paths.hg.ref,
			out: paths.hg.bin,
			options: {
				target: "es5",
				module: "commonjs",
				sourcemap: true,
				declaration: true,
				fullSourceMapPath: true
			}
		},
		game: {
			src: [ paths.libs ].concat(paths.hg.def, paths.game.source),
			out: paths.game.bin,
			options: {
				target: "es5",
				comments: true,
				declaration: true,
				sourcemap: false
			}
		}
	},
	watch: {
		hg: {
			files: paths.hg.source,
			tasks: ['hg'],
			options: {
				livereload: true
			}
		},
		game: {
			files: paths.game.source,
			tasks: ['game'],
			options: {
				livereload: true
			}
		}
	},
	nodeunit: {
		hg: paths.test.source
	}
};

module.exports = function(grunt) {
	grunt.initConfig(config);

	var gameTasks = ["tslint:game", "ts:game"];
	var allTasks = ["jade", "tslint", "ts", "nodeunit"];

	var files = fs.readdirSync(paths.meta.plugins);
	files.forEach(function (file) {
		var plugin = require("./"+paths.meta.plugins+"/"+file);
		var instance = new plugin(grunt);
		grunt.registerTask(instance.name, instance.description, function() {
			instance.handler(paths);
		});
		allTasks.push(instance.name);
		gameTasks.push(instance.name);
	});

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("hg", ["jade", "tslint:hg", "ts:hg", "nodeunit:hg"]);
	grunt.registerTask("default", ["tslint:hg", "ts", "nodeunit"]);
	grunt.registerTask('all', allTasks);
	grunt.registerTask('yall', allTasks);
	grunt.registerTask("game", gameTasks);
};