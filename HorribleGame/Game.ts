/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-08 14:22:38
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
game.pluginHost.load(loader.directory("plugins"));

if (HG.settings.debug === true) {
	HG.Utils.devTools();
}

game.on("load", () => {
	loader.scene("scenes/test.scene.json", (scene: HG.Scenes.BaseScene) => {
		mainScene = scene;
		var cam = new HG.Entities.ChasingCameraEntity(mainScene.get<HG.Entities.MeshEntity>("player"),
				HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
				0.1, HG.settings.graphics.viewDistance);
		cam.offset(0, 25, -25).rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782).
			position(-27.512701511383057, 250, 211.5527195930481);
		mainScene.camera = cam;
		game.scene(mainScene);
		game.start();
	});
});

game.controls.keyboard.bind(HG.settings.keys.refresh, (delta: number) => {
	game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, (delta: number) => {
	game.toggleFullScreenMode();
});

game.on(["start", "resize"], () => {
	$("resolution").innerText = locale.debugInfo.resolution.f(game.resolution.x, game.resolution.y);
});

game.on("render", (delta: number) => {
	$("fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
	$("verts").innerText = locale.debugInfo.verts.f(game.renderer.info.render.vertices);
	$("frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
});

window.onload = () => game.load();