/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 12:24:48
*/
/// <reference path="GameLocale.ts" />

HG.horrible();
// $ is the same as document.getElementById, just shorter
var gameCanvas = $("gameWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json<GameLocale>("locale/game.locale.json");
// var server = new HG.Core.BaseServer(9898);

if (HG.settings.debug === true) {
	HG.Utils.devTools();
}

var testScene;
var player = new HG.Entities.MeshEntity();
var room = new HG.Entities.MeshEntity();
var sprite = new HG.Entities.SpriteEntity();
var cam = new HG.Entities.ChasingCameraEntity(player, HG.settings.graphics.fov,
		window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
cam.offset(0, 25, -25).rotate(75, 75, 0);
mainScene.camera(cam);

game.pluginHost.load(loader.directory("plugins"));

game.on("load", () => {
	game.renderer.setClearColor(new THREE.Color(0x000000), 0.5);

	var playerMove = new HG.Abilities.MovingAbility();
	player.ability(playerMove);
	var playerLight = new HG.Entities.BaseEntity(
		new THREE.PointLight(0xffffff, 3, HG.settings.graphics.viewDistance / 10));
	playerLight.ability(playerMove);
	playerLight.offset(0, 150, 0)
				.position(0, 0, 0);
	mainScene.add(playerLight, "playerLight");

	var animationAbility = new HG.Abilities.AnimationAbility();
	player.ability(animationAbility);
	player.on("loaded", () => {
		player.scale(10, 10, 10)
				.offset(0, 0, 50);
		mainScene.add(player, "player");
	});
	loader.model("models/android.js", player);

	var effectsChannel = game.soundMixer.channel("effectsEnv");
	var sound1 = effectsChannel.effect();
	loader.sound("sounds/001.wav", sound1);

	testScene = loader.scene("scenes/test.scene.json");

	mainScene.controls.keyboard.bind(HG.settings.keys.left, (delta: number) => {
		playerMove.turnLeft(3.125 * delta);
	});

	mainScene.controls.keyboard.bind(HG.settings.keys.right, (delta: number) => {
		playerMove.turnRight(3.125 * delta);
	});

	mainScene.controls.keyboard.bind(HG.settings.keys.forward, (delta: number) => {
		playerMove.moveForward(3.125 * delta);
		animationAbility.running = true;
	});

	mainScene.controls.keyboard.bind(HG.settings.keys.backward, (delta: number) => {
		playerMove.moveBackward(3.125 * delta);
		animationAbility.running = true;
	});

	mainScene.controls.keyboard.bind(HG.settings.keys.lower, (delta: number) => {
		playerMove.lower(3.125 * delta);
		animationAbility.running = true;
	});

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
	$("fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
	$("verts").innerText = locale.debugInfo.verts.f(game.renderer.info.render.vertices);
	$("frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
});

window.onload = () => game.load();