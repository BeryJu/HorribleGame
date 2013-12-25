#!/usr/bin/env nodejs
var repl = require("repl");
var vm = require("vm");
var fs = require("fs");
var execute = function(path, context) {
	var data = fs.readFileSync(path);
	vm.runInThisContext(data, path);
}
execute("bin/lib/dependencies/three.js");
var HG = require("./bin/lib/hg.js").horrible();
var server = repl.start("hg> ");
server.context.HG = HG;