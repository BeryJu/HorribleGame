var paths = {
	gameRoot: "HorribleGame/",
	assetRoot: "bin/assets/",
	gameBin: "bin/game/game.js",
	gamePaths: [
		"HorribleGame/scenes/*.ts",
		"HorribleGame/*.ts"
	],
	hgPaths: [
		"src/HG/*.ts",
		"src/HG/**/*.ts",
		"src/HG/**/**/*.ts"
	],
	libs: [
		"src/lib/*.d.ts"
	],
	testPaths: [
		"tests/*.js",
		"tests/**/*.js"
	],
	dist: "dist/",
	hgRef: "src/HG/HG.ref.ts",
	hgBin: "bin/lib/hg.js",
	hgDef: "bin/lib/hg.d.ts",
};

var config = {
	paths: paths,
	jade: {
		hg: {
			options: {
				pretty: true,
				data: {
					title: "HorribleGame",
					liveReload: "http://juggernaut:35729/livereload.js"
				}
			},
			files: {
				"bin/index.html": "src/index.jade"
			}
		}
	},
	tslint: {
		options: {
			configuration: require("./src/tslint.json")
		},
		hg: {
			src: paths.hgPaths
		},
		game: {
			src: paths.gamePaths
		}
	},
	ts: {
		hg: {
			src: paths.libs.concat(paths.hgPaths),
			reference: paths.hgRef,
			out: paths.hgBin,
			options: {
				target: "es5",
				module: "commonjs",
				sourcemap: true,
				declaration: true,
				fullSourceMapPath: true
			}
		},
		game: {
			src: paths.libs.concat(paths.hgDef, paths.gamePaths),
			out: paths.gameBin,
			options: {
				target: "es5",
				comments: true,
				sourcemap: false
			}
		}
	},
	watch: {
		hg: {
			files: paths.hgPaths,
			tasks: ['hg'],
			options: {
				livereload: true
			}
		},
		game: {
			files: paths.gamePaths,
			tasks: ['game'],
			options: {
				livereload: true
			}
		}
	},
	nodeunit: {
		hg: paths.testPaths
	}
}
module.exports = function(grunt) {
	grunt.initConfig(config);

	var pluginPath = "src/grunt/";
	var fs = require("fs");
	var files = fs.readdirSync(pluginPath);

	var gameTasks = ["tslint:game", "ts:game"];
	var allTasks = ["jade", "tslint", "ts", "nodeunit"];

	files.forEach(function (file) {
		var plugin = require("./"+pluginPath+"/"+file);
		var instance = new plugin(grunt);
		grunt.registerTask(instance.name, instance.description, instance.handler);
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

	grunt.registerTask("game", gameTasks);
};