HG.horrible();

var gameCanvas = $("gameWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json("locale/game.locale.json");

if (HG.settings.debug === true) {
    HG.Utils.devTools();
}

game.pluginHost.load(loader.directory("plugins"));

game.on("load", function () {
    mainScene = loader.scene("scenes/test.scene.json");
    var cam = new HG.Entities.CameraEntity(HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
    cam.offset(0, 25, -25).rotate(75, 75, 0);
    mainScene.color = new THREE.Color(0x000000);

    mainScene.camera = cam;
    game.scene(mainScene);

    game.start();
});

game.controls.keyboard.bind(HG.settings.keys.refresh, function (delta) {
    game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, function (delta) {
    game.toggleFullScreenMode();
});

game.on(["start", "resize"], function () {
    $("resolution").innerText = locale.debugInfo.resolution.f(window.innerWidth, window.innerHeight);
});

game.on("render", function (delta) {
    $("fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
    $("verts").innerText = locale.debugInfo.verts.f(game.renderer.info.render.vertices);
    $("frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
});

window.onload = function () {
    return game.load();
};
//# sourceMappingURL=game.js.map
