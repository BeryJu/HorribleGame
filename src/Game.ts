var game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));
var pkg = require("./package.json");
console.log("HorribleGame build "+pkg.build);
game.on('preload', function() {
	var color = 0x312443;
	var Player = new HG.Entities.MovingEntity({
		position: new THREE.Vector3(-37.5, 250, 0),
		object: new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshBasicMaterial({color: color}))
	});
	var PlayerLight = new HG.Entities.MovingEntity({
		position: new THREE.Vector3(-37.5, 250, 0),
		object: new THREE.PointLight(color, 5, HG.Settings.viewDistance / 2)
	});
	game.scene.add(Player, "Player");
	game.scene.add(PlayerLight, "PlayerLight");
	// var levelStruct = new HG.LevelStructure();
	// levelStruct.on('created', function(args: {}) {
	// 	var level = new HG.Level(args['level']);
	// 	level.entities.forEach(function(e) {
	// 		game.scene.add(e);
	// 	});
	// 	level.applyCamera(game.camera);
	// });
	// levelStruct.create();
	var levelStruct = new HG.LevelStructure();
	levelStruct.on('loaded', function(args: {}) {
		var level = new HG.Level(args['level']);
		level.entities.forEach(function(e) {
			game.scene.add(e);
		});
		level.applyCamera(game.camera);
	});
	levelStruct.loadAsync("app://hg/assets/level1.json");
});

game.on('start', function() {
	document.getElementById('build').innerText = "HorribleGame build "+pkg.build; 
	window.onresize = function() {game.onResize()};
	window.onkeydown = function(a: any) {game.onKeyDown(a)};
	window.onkeyup = function(a: any) {game.onKeyUp(a)};
	var r = function() {
		game.render();
		requestAnimationFrame(r);
	};
	r();
});

game.on('keydown', function(a: {}) {
	if (a['event']['keyCode'] === HG.Settings.keys.devConsole) {
		HG.Utils.openDevConsole();
	}
});

game.controls.bind(HG.Settings.keys.fullscreen, function(args: {}) {
	HG.Utils.toggleFullScreenMode();
});

game.controls.bind(HG.Settings.keys.left, function(args: {}) {
	game.scene.get(["Player", "PlayerLight"], HG.Entities.MovingEntity).forEach(function(e) {
		e.moveLeft(3.125 * args['delta']);
	});
	game.camera.position.x -= 3.125 * args['delta'];
});

game.controls.bind(HG.Settings.keys.right, function(args: {}) {
	game.scene.get(["Player", "PlayerLight"], HG.Entities.MovingEntity).forEach(function(e) {
		e.moveRight(3.125 * args['delta']);
	});
	game.camera.position.x += 3.125 * args['delta'];
});

game.controls.bind(HG.Settings.keys.jump, function(args: {}) {
	game.scene.get(["Player", "PlayerLight"], HG.Entities.MovingEntity).forEach(function(e) {
		e.jump();
	});
});

game.on(['start', 'resize'], function() {
	document.getElementById("resolution").innerText = 
		"Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

game.on("connected", function(args: {}) {
	document.getElementById("server").innerText = "Connected to "+args['host'];
});

game.on("render", function(args: {}) {
	game.scene.get(["Player", "PlayerLight"], HG.Entities.MovingEntity).forEach(function(e) {
		e.frame(args['delta']);
	});
	document.getElementById("fps").innerText = "FPS: "+game.fpsCounter.getFPS();
	document.getElementById("hfps").innerText = "Highest FPS: "+game.fpsCounter.getMaxFPS();
	document.getElementById("frametime").innerText =
		"Frametime: "+game.fpsCounter.getFrameTime()+"ms";
});

window.onload = function() {
	game.preLoad();
};

var srv = new HG.BaseServer(9898);

if (game.isRunning === false) {
	game.start("http://localhost:9898");
}