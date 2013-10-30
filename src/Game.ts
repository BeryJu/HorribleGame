var loader = new HG.ModuleLoader();
var game = new HG.BaseGame(document.getElementById("gameWrapper"));
// game.loadShader('assets/shaders/heightmap.js')
var pkg = require("./package.json");
console.log("HorribleGame build "+pkg.build);
game.on('preload', function() {

	game.renderer.setClearColor(new THREE.Color(0x000000), 1);

	// game.camera.addAbility(new HG.Abilities.MovingAbility());
	// game.scene.add(game.camera, "camera1");

	var playerLight = new HG.BaseEntity(
		new THREE.PointLight(0xffffff, 3, HG.Settings.viewDistance / 10));
	playerLight.addAbility(new HG.Abilities.MovingAbility());
	playerLight.offset(0, 150, 0);
	// playerLight.rotate(0, HG.Utils.degToRad(90), 0);
	game.scene.add(playerLight, "playerLight");

	// //create a skybox for demo purposes
	// var skyBox = new HG.Entities.SkyBoxEntity("app://hg/assets/textures/skybox/",
	// 			HG.Settings.viewDistance * 1.75);
	// //add moving ability so it's fixed to the camera
	// skyBox.addAbility(new HG.Abilities.MovingAbility());
	// //add it to the scene
	// game.scene.add(skyBox, "skyBox");

	var player = new HG.Entities.MeshEntity();
	player.addAbility(new HG.Abilities.MovingAbility());
	var animationAbility = new HG.Abilities.AnimationAbility();
	player.addAbility(animationAbility);
	animationAbility.on('loaded', () => {
		player.scale(10, 10, 10);
		player.offset(0, 0, 50);
		// player.rotate(0, HG.Utils.degToRad(90), 0);
		game.scene.forNamed((e) => e.position(0, 0, 0));
		game.scene.add(player, "player");
	});
	animationAbility.loadAsync("assets/models/android.js");


	var levelStruct = new HG.LevelStructure();
	levelStruct.on(['loaded', 'created'], (args: {}) => {
		var level = new HG.Level(args['level']);
		level.entities.forEach((e) => {
			game.scene.add(e);
		});
		var cam = new HG.Entities.ChasingCameraEntity(player, HG.Settings.fov,
					window.innerWidth / window.innerHeight, 0.1, HG.Settings.viewDistance);
		level.applyCameraOffset(cam);
		game.camera = cam;
	});
	// levelStruct.loadAsync("assets/levels/level1.json");
	levelStruct.create();

	if (HG.Settings.debug === true) {
		var axes = new HG.BaseEntity(new THREE.AxisHelper(500));
		axes.position(0, 0, 0)
		game.scene.add(axes);
	}
});

game.on('start', () => {
	document.getElementById('build').innerText = "HorribleGame build "+pkg.build; 
	window.onresize = () => game.onResize();
	window.onkeydown = (a: any) => game.onKeyDown(a);
	window.onkeyup = (a: any) => game.onKeyUp(a);
	var render = () => { game.render(); requestAnimationFrame(render); };
	if (HG.Settings.debug === true) {
		console.profile("Frame");
		game.render();
		console.profileEnd();
	}
	render();
});

game.on('keydown', (a: {}) => {
	if (a['event']['keyCode'] === HG.Settings.keys.devConsole) {
		HG.Utils.openDevConsole();
	}
});

game.controls.bind(HG.Settings.keys.refresh, (args: {}) => {
	HG.Utils.reload();
});

game.controls.bind(HG.Settings.keys.fullscreen, (args: {}) => {
	HG.Utils.toggleFullScreenMode();
});

game.controls.bind(HG.Settings.keys.left, (args: {}) => {
	game.scene.forNamed((e) => {
		e.forAbilities((a) => {
			if (a instanceof HG.Abilities.MovingAbility) a.turnLeft(3.125 * args['delta']);
			// if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.right, (args: {}) => {
	game.scene.forNamed((e) => {
		e.forAbilities((a) => {
			if (a instanceof HG.Abilities.MovingAbility) a.turnRight(3.125 * args['delta']);
			// if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.forward, (args: {}) => {
	game.scene.forNamed((e) => {
		e.forAbilities((a) => {
			if (a instanceof HG.Abilities.MovingAbility) a.moveForward(3.125 * args['delta']);
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.backward, (args: {}) => {
	game.scene.forNamed((e) => {
		e.forAbilities((a) => {
			if (a instanceof HG.Abilities.MovingAbility) a.moveBackward(3.125 * args['delta']);
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.lower, (args: {}) => {
	game.scene.forNamed((e, tag) => {
		e.forAbilities((a) => {
			if (a instanceof HG.Abilities.MovingAbility) a.lower(3.125 * args['delta']);
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.controls.bind(HG.Settings.keys.jump, (args: {}) => {
	game.scene.forNamed((e) => {
		e.forAbilities((a) => {
			if (a instanceof HG.Abilities.MovingAbility) a.jump();
			if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
		});
	});
});

game.on(['start', 'resize'], () => {
	document.getElementById("resolution").innerText = 
		"Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

game.on("connected", (args: {}) => {
	document.getElementById("server").innerText = "Connected to "+args['host'];
});

game.on("render", (args: {}) => {
	game.scene.forNamed((e) => e.frame(args['delta']));
	document.getElementById("fps").innerText = "FPS: "+game.fpsCounter.getFPS();
	document.getElementById("verts").innerText = "Vertices: "+game.renderer.info.render.vertices;
	document.getElementById("frametime").innerText =
		"Frametime: "+game.fpsCounter.getFrameTime()+"ms";
});

window.onload = () => game.preLoad();

var srv = new HG.BaseServer(9898);

if (game.isRunning === false) {
	game.start("http://localhost:9898");
}