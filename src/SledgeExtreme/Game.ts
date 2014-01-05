/*
* @Author: BeryJu
* @Date:   2013-12-06 16:43:52
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 21:41:53
*/

/// <reference path="GameLocale.ts" />
/// <reference path="scenes/Main.ts" />
HG.horrible();
var gameCanvas = query("#canvasWrapper");
var loader = new HG.Resource.Loader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var locale = loader.json<GameLocale>("locale/game.locale.json");
loader.directory("fonts/", ".typeface.json").forEach((file) => {
	loader.font(file);
});

if (HG.settings.debug === true) {
	HG.Utils.devTools();
}

game.on("loaded", () => {
	game.pluginHost.load(loader.directory("plugins", ".js"));
	var mainSceneLoader = MainScene.create(game, loader);
	mainSceneLoader.on("progress", (queue: HG.Core.Queue<number, HG.Entities.Entity>) => {
		"${0}% loaded".f(queue.percentage).log();
	});

	mainSceneLoader.on("done", (scene: HG.Core.Scene, duration: Date) => {
		"Loading duration: ${0}:${1} mins".
			f(duration.getMinutes(), duration.getSeconds()).log();
		game.scene(scene);
		scene.camera("mainCamera");
		game.start({
			mouseLock: true,
			input: true,
			profileFrame: false,
			noResize: true
		});
	});
	mainSceneLoader.start();
});

game.controls.keyboard.bind(HG.settings.keys.refresh, (delta: number) => {
	game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, (delta: number) => {
	game.toggleFullScreenMode();
});

game.on("render", (delta: number) => {
	game.title = game.fpsCounter.FPS + " " + game.fpsCounter.frameTime;
});

window.onload = () => game.load();
