/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 18:14:35
*/
/// <reference path="GameLocale.ts" />

HG.horrible();
// $ is the same as document.getElementById, just shorter
var gameCanvas = $("gameWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json<GameLocale>("locale/game.locale.json");

var player = new HG.Entities.MeshEntity();
var room = new HG.Entities.MeshEntity();
// var srv = new HG.BaseServer(9898);
game.pluginHost.load(loader.directory("plugins"));
game.on("load", () => {
	game.renderer.setClearColor(new THREE.Color(0x000000), .5);

	var playerLight = new HG.Entities.BaseEntity(
		new THREE.PointLight(0xffffff, 3, HG.settings.graphics.viewDistance / 10));
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

	// var playerMove = new HG.Abilities.MovingAbility();
	// player.ability(playerMove);
	// playerLight.ability(playerMove);

	// var animationAbility = new HG.Abilities.AnimationAbility();
	// player.ability(animationAbility);

	// player.on("loaded", () => {
	// 	player.scale(10, 10, 10)
	// 			.offset(0, 0, 50);
	// 	mainScene.add(player, "player");
	// });
	// loader.model("models/android.js", player);

	// var soundEffects = game.soundMixer.channel("effectsEnv");
	// var sound1 = soundEffects.effect();
	// var sound1 = new HG.Sound.Effect(game.soundMixer.channel("effectsEnv"));
	// loader.sound("sounds/001.wav", sound1);

	room.on("loaded", () => {
		room.scale(5, 5, 5)
			.offset(0, 0, 250)
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
	// 	var cam = new HG.Entities.ChasingCameraEntity(player, HG.settings.graphics.fov,
	// 			window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
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
	HG.Utils.bootstrap(game);
});

game.controls.keyboard.bind(HG.settings.keys.refresh, (delta: number) => {
	game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, (delta: number) => {
	game.toggleFullScreenMode();
});

game.on(["start", "resize"], () => {
	$("resolution").innerText = locale.debugInfo.resolution.f(window.innerWidth, window.innerHeight);
});

game.on("render", (delta: number) => {
	mainScene.forNamed((e) => e.frame(delta));
	$("fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
	$("verts").innerText = locale.debugInfo.verts.f(game.renderer.info.render.vertices);
	$("frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
});

window.onload = () => game.load();