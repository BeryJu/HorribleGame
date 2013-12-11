var paths = {
	gameRoot: "HorribleGame/",
	assetsRoot: "bin/assets/",
	gameBin: "bin/game/game.js",
	gamePaths: [
		"HorribleGame/*.ts"
	],
	hgPaths: [
		"src/HG/*.ts",
		"src/HG/**/*.ts",
		"src/HG/**/**/*.ts"
	],
	hgRef: "src/HG/HG.ref.ts",
	libs: [
		"src/lib/*.d.ts"
	],
	testPaths: [
		"tests/*.js",
		"tests/**/*.js"
	],
	dist: "dist/",
	outHG: "bin/lib/hg.js",
	hgDef: "bin/lib/hg.d.ts",
};

var config = {
	paths: paths,
	tslint: {
		options: {
			configuration: require("./hg/tslint.json")
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
			out: paths.outHG,
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
	nodeunit: {
		hg: paths.testPaths
	}
}
module.exports = function(grunt) {
	grunt.initConfig(config);

	var pluginPath = "hg/grunt/";
	var fs = require("fs");
	var files = fs.readdirSync(pluginPath);

	var gameTasks = ["tslint:game", "ts:game"];
	var allTasks = ["tslint", "ts", "nodeunit"];

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

	grunt.registerTask("hg", ["tslint:hg", "ts:hg", "nodeunit:hg"]);
	grunt.registerTask("default", ["tslint:hg", "ts", "nodeunit"]);
	grunt.registerTask('all', allTasks);

	grunt.registerTask("game", gameTasks);
};