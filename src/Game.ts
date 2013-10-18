var game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));
var pkg = require("./package.json");
console.log("HorribleGame build "+pkg.build);
game.on('preload', function() {
	var color = 0xffffff;
	var playerLight = new HG.Entities.MovingEntity(
		new THREE.PointLight(color, 3, HG.Settings.viewDistance));
	playerLight.offset(0, 50, 0);
	game.scene.add(playerLight, "playerLight");
	var playerModel = new HG.Entities.AnimatedEntity();
	playerModel.on('loaded',function() {
		playerModel.object.scale.set(10,10,10);
		playerModel.object.rotation.y = HG.Utils.degToRad(90);
		game.scene.add(playerModel, "playerModel");
		game.scene.forAllNamed(function(e) {
			e.position(-37.5, 270, 0);
		});
	});
	playerModel.loadAsync("app://hg/assets/models/android.json");
	var levelStruct = new HG.LevelStructure();
	levelStruct.on('loaded', function(args: {}) {
		var level = new HG.Level(args['level']);
		level.entities.forEach(function(e) {
			game.scene.add(e);
		});
		level.applyCamera(game.camera);
	});
	levelStruct.loadAsync("app://hg/assets/levels/level1.json");
});

// var levelStruct = new HG.LevelStructure();
// levelStruct.on('created', function(args: {}) {
// 	var level = new HG.Level(args['level']);
// 	level.entities.forEach(function(e) {
// 		game.scene.add(e);
// 	});
// 	level.applyCamera(game.camera);
// });
// levelStruct.create();

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
	game.scene.forAllNamed(function(e) {
		if (e instanceof HG.Entities.MovingEntity) e.moveLeft(3.125 * args['delta']);
		if (e instanceof HG.Entities.AnimatedEntity) e.running = true;
	});
	game.camera.position.x -= 3.125 * args['delta'];
});

game.controls.bind(HG.Settings.keys.right, function(args: {}) {
	game.scene.forAllNamed(function(e) {
		if (e instanceof HG.Entities.MovingEntity) e.moveRight(3.125 * args['delta']);
		if (e instanceof HG.Entities.AnimatedEntity) e.running = true;
	});
	game.camera.position.x += 3.125 * args['delta'];
});

game.controls.bind(HG.Settings.keys.jump, function(args: {}) {
	game.scene.forAllNamed(function(e) {
		if (e instanceof HG.Entities.MovingEntity) e.jump();
		if (e instanceof HG.Entities.AnimatedEntity) e.running = true;
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
	game.scene.getAll().forEach(function(e) {
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