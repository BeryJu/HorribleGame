/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 14:08:37
*/

/// <reference path="GameLocale.ts" />
/// <reference path="scenes/Main.ts" />

// Initialize HG
HG.horrible();

// query is the same as document.querySelector, just shorter
var gameCanvas = query("#canvasWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var locale = loader.json<GameLocale>("locale/game.locale.json");

if (HG.settings.debug === true) {
	HG.Utils.devTools();
}

game.on("load", () => {
	game.pluginHost.load(loader.directory("plugins", ".js"));
	MainScene.create(loader, (scene: HG.Core.Scene) => {
		game.scene(scene);
		scene.camera("mainCamera");
		game.lockMouse();
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
	query("#fps").innerText = "FPS: " + game.fpsCounter.FPS;
	query("#frametime").innerText = "Frametime: " + game.fpsCounter.frameTime;
	query("#calls").innerText = "Calls: " + game.renderer.info.render.calls;
	query("#vertices").innerText = "Vertices: " + game.renderer.info.render.vertices;
});

window.onload = () => game.load();