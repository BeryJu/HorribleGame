HG.horrible();

var gameCanvas = query("#canvasWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json("locale/game.locale.json");

game.pluginHost.load(loader.directory("plugins"));
var cam;

if (HG.settings.debug === true) {
    HG.Utils.devTools();
}

game.on("load", function () {
    loader.scene("scenes/test.scene.json", function (scene) {
        mainScene = scene;
        game.scene(mainScene);
        game.start({
            input: true,
            profileFrame: false,
            noResize: true
        });
    });
});

game.controls.keyboard.bind(HG.settings.keys.refresh, function (delta) {
    game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, function (delta) {
    game.toggleFullScreenMode();
});

game.on("render", function (delta) {
    query("#fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
    query("#frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
    query("#calls").innerText = HG.locale.debug.calls.f(game.renderer.info.render.calls);
    query("#vertices").innerText = HG.locale.debug.vertices.f(game.renderer.info.render.vertices);
});

window.onload = function () {
    return game.load();
};
