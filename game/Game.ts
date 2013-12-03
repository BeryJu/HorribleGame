HG.horrible();
var game = new HG.Core.BaseGame(document.getElementById("gameWrapper"), "settings.json");
var mainScene = new HG.Scenes.BaseScene();
var loader = new HG.Resource.ResourceLoader("assets/");
// var srv = new HG.BaseServer(9898);
game.pluginHost.load(loader.directory("plugins"));
loader.locale("locale/HG.locale.json", (locale: HG.Locale.Locale) => {
	HG.locale = locale;
});
game.on("load", () => {
	game.renderer.setClearColor(new THREE.Color(0x000000), .5);

	var playerLight = new HG.Entities.BaseEntity(
		new THREE.PointLight(0xffffff, 3, HG.settings.graphics	.viewDistance / 10));
	playerLight.offset(0, 150, 0)
				.position(0, 0, 0);
	mainScene.add(playerLight, "playerLight");

	// var particles = new HG.Entities.ParticleEntity("assets/textures/particle.png");
	// scene.add(particles, "particles");

	// create a skybox for demo purposes
	// var skyBox = new HG.Entities.SkyBoxEntity(HG.settings.viewDistance * 2);
	// loader.directory("textures/skybox").forEach((tex) => {
	// 	skyBox
	// });
	// add it to the scene
	// mainScene.add(skyBox, "skyBox");

	var player = new HG.Entities.MeshEntity();

	var playerMove = new HG.Abilities.MovingAbility();
	player.ability(playerMove);
	playerLight.ability(playerMove);

	var animationAbility = new HG.Abilities.AnimationAbility();
	player.ability(animationAbility);

	player.on("loaded", () => {
		player.scale(10, 10, 10)
				.offset(0, 0, 50);
		mainScene.add(player, "player");
	});
	loader.model("models/android.js", player);

	var sound1 = new HG.Sound.Effect(game.soundMixer.channel("effectsEnv"));
	loader.sound("sounds/001.wav", sound1);

	var room = new HG.Entities.MeshEntity();
	room.on("loaded", () => {
		room.scale(5, 5, 5)
			.offset(0, 0, 50)
			.rotate((90).toRadian(), 0, 0);
		mainScene.add(room);
	});
	loader.model("models/room01.stl", room);

	// var levelStruct = new HG.Level.LevelStructure();
	// levelStruct.on(["loaded", "created"], (args: {}) => {
	// 	var level = new HG.Level.Level(args["level"]);
	// 	level.entities.forEach((e) => {
	// 		scene.add(e);
	// 	});
	// 	var cam = new HG.Entities.ChasingCameraEntity(player, HG.settings.graphics	.fov,
	// 			window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics	.viewDistance);
	// 	level.applyCameraOffset(cam);
	// 	game.camera = cam;
	// });
	// // levelStruct.loadAsync("assets/levels/level1.json");
	// levelStruct.create();

	if (HG.settings.debug === true) {
		var axes = new HG.Entities.BaseEntity(new THREE.AxisHelper(500));
		axes.position(0, 0, 0);
		mainScene.add(axes);
	}

	game.start();
});

game.on("start", () => {
	game.scene(mainScene);
	// HG.Utils.bootstrap(game, window);
	if (HG.settings.debug === true) {
		HG.Utils.profile(() => {
			game.render();
		});
	}
	window.onresize = () => game.onResize();
	window.onkeydown = (a: any) => game.onKeyDown(a);
	window.onkeyup = (a: any) => game.onKeyUp(a);
	window.onmousemove = (a: any) => game.onMouseMove(a);
	window.onmousedown = (a: any) => game.onMouseDown(a);
	window.onmouseup = (a: any) => game.onMouseUp(a);
	var render;
	if (HG.settings.graphics	.useStaticFramerate === true) {
		render = () => { game.render(); };
		setInterval(render, 1000 / HG.settings.graphics	.staticFramerate);
	} else {
		render = () => {
			game.render();
			requestAnimationFrame(render);
		};
	}
	render();
});

game.controls.keyboard.bind(HG.settings.keys.refresh, (delta: number) => {
	game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, (delta: number) => {
	game.toggleFullScreenMode();
});

game.on(["start", "resize"], () => {
	// document.getElementById("resolution").innerText =
	// 		"Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

game.on("render", (delta: number) => {
	mainScene.forNamed((e) => e.frame(delta));
	// document.getElementById("fps").innerText = "FPS: "+game.fpsCounter.FPS;
	// document.getElementById("verts").innerText = "Vertices: "+game.renderer.info.render.vertices;
	// document.getElementById("frametime").innerText =
	// 		"Frametime: "+game.fpsCounter.frameTime+"ms";
});

window.onload = () => game.load();