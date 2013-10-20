var game = new HG.BaseGame(document.getElementById("gameWrapper"));
var pkg = require("./package.json");
console.log("HorribleGame build "+pkg.build);
game.on('preload', function() {

	game.camera.addAbility(new HG.Abilities.MovingAbility());
	game.scene.add(game.camera, "camera1");

	var playerLight = new HG.BaseEntity(
		new THREE.PointLight(0xffffff, 3, HG.Settings.viewDistance));
	playerLight.addAbility(new HG.Abilities.MovingAbility());
	playerLight.offset(0, 150, 0);
	game.scene.add(playerLight, "playerLight");

	var textGeom = new THREE.TextGeometry(pkg.build, {
		size: 30, height: 4, curveSegments: 3,
		font: "helvetiker", style: "normal",
		bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
		material: 0, extrudeMaterial: 1
	});
	textGeom.computeBoundingBox();
	var textMesh = new THREE.Mesh(textGeom, new THREE.MeshPhongMaterial(0xff00ff) );
		
	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
	var text = new HG.BaseEntity(textMesh);
	text.addAbility(new HG.Abilities.MovingAbility());
	text.offset(0, 0, 75);
	text.position(-.5 * textWidth, 50, 100);
	text.rotate(0, HG.Utils.degToRad(270), 0);
	game.scene.add(text, "derp");


	var skyBox = new HG.Entities.SkyBoxEntity("app://hg/assets/textures/skybox/",
				HG.Settings.viewDistance * 1.75);
	skyBox.addAbility(new HG.Abilities.MovingAbility());
	game.scene.add(skyBox, "skyBox");

	var player = new HG.BaseEntity();
	player.addAbility(new HG.Abilities.MovingAbility());
	
	var animationAbility = new HG.Abilities.AnimationAbility();
	player.addAbility(animationAbility);
	animationAbility.on('loaded',function() {
		player.scale(10, 10, 10);
		player.rotate(0, HG.Utils.degToRad(90), 0);
		game.scene.add(player, "player");
		game.scene.forNamed(function(e) {
			e.position(-37.5, 270, 0);
		});
	});
	animationAbility.loadAsync("app://hg/assets/models/android.json");
	var levelStruct = new HG.LevelStructure();
	levelStruct.on('loaded', function(args: {}) {
		var level = new HG.Level(args['level']);
		level.entities.forEach(function(e) {
			game.scene.add(e);
		});
		level.applyCameraOffset(game.camera);
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
	game.scene.forNamed(function(e) {
		e.forAbilities(function(a) {
			if (a instanceof HG.Abilities.MovingAbility) a.moveLeft(3.125 * args['delta']);
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.right, function(args: {}) {
	game.scene.forNamed(function(e) {
		e.forAbilities(function(a) {
			if (a instanceof HG.Abilities.MovingAbility) a.moveRight(3.125 * args['delta']);
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.jump, function(args: {}) {
	game.scene.forNamed(function(e) {
		e.forAbilities(function(a) {
			if (a instanceof HG.Abilities.MovingAbility) a.jump();
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
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
	game.scene.forAll(function(e) { e.frame(args['delta']); });
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