/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-13 16:03:54
*/

/// <reference path="GameLocale.ts" />

// Initialize HG
HG.horrible();

// $ is the same as document.getElementById, just shorter
var gameCanvas = $("#canvasWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json<GameLocale>("locale/game.locale.json");
// var server = new HG.Core.BaseServer(9898);
game.pluginHost.load(loader.directory("plugins"));
var cam;

if (HG.settings.debug === true) {
	HG.Utils.devTools();
}

game.on("load", () => {
	loader.scene("scenes/test.scene.json", (scene: HG.Scenes.BaseScene) => {
		mainScene = scene;
		cam = new HG.Entities.ChasingCameraEntity(
			<HG.Entities.MeshEntity> mainScene.entities.get("player"),
			HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
			0.1, HG.settings.graphics.viewDistance);
		cam.name = "workingCam";
		cam.offset(0, 25, -25).rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782).
			position(-27.512701511383057, 250, 211.5527195930481);
		mainScene.add(cam);
		mainScene.camera("workingCam");
		game.scene(mainScene);
		game.start({
			input: true,
			profileFrame: false,
			noResize: true
		});
	});
});

game.controls.keyboard.bind(HG.settings.keys.refresh, (delta: number) => {
	game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, (delta: number) => {
	game.toggleFullScreenMode();
});

game.on("render", (delta: number) => {
	$("#fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
	$("#frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
	$("#calls").innerText = HG.locale.debug.calls.f(game.renderer.info.render.calls);
	$("#vertices").innerText = HG.locale.debug.vertices.f(game.renderer.info.render.vertices);
});

window.onload = () => game.load();