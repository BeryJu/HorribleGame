HG.horrible();

var gameCanvas = $("#canvasWrapper");
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
        cam = new HG.Entities.ChasingCameraEntity(mainScene.entities.get("player"), HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
        cam.name = "workingCam";
        cam.offset(0, 25, -25).rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782).position(-27.512701511383057, 250, 211.5527195930481);
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

game.controls.keyboard.bind(HG.settings.keys.refresh, function (delta) {
    game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, function (delta) {
    game.toggleFullScreenMode();
});

game.on("render", function (delta) {
    $("#fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
    $("#frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
    $("#calls").innerText = HG.locale.debug.calls.f(game.renderer.info.render.calls);
    $("#vertices").innerText = HG.locale.debug.vertices.f(game.renderer.info.render.vertices);
});

window.onload = function () {
    return game.load();
};
