/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 14:37:04
*/
/// <reference path="GameLocale.ts" />
// Initialize HG
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

var cam = new HG.Entities.ChasingCameraEntity(player, HG.settings.graphics.fov,
		window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
cam.offset(0, 25, -25).rotate(75, 75, 0);
mainScene.camera(cam);

game.pluginHost.load(loader.directory("plugins"));

game.on("load", () => {
	var effectsChannel = game.soundMixer.channel("effectsEnv");
	var sound1 = effectsChannel.effect();
	loader.sound("sounds/001.wav", sound1);

	mainScene = loader.scene("scenes/test.scene.json");

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