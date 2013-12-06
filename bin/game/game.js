HG.horrible();

var gameCanvas = $("gameWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json("locale/game.locale.json");

var player = new HG.Entities.MeshEntity();
var room = new HG.Entities.MeshEntity();

game.pluginHost.load(loader.directory("plugins"));
game.on("load", function () {
    game.renderer.setClearColor(new THREE.Color(0x000000), .5);

    var playerLight = new HG.Entities.BaseEntity(new THREE.PointLight(0xffffff, 3, HG.settings.graphics.viewDistance / 10));
    playerLight.offset(0, 150, 0).position(0, 0, 0);
    mainScene.add(playerLight, "playerLight");

    room.on("loaded", function () {
        room.scale(5, 5, 5).offset(0, 0, 250).rotate((90).toRadian(), 0, 0);
        mainScene.add(room);
    });
    loader.model("models/room01.stl", room);

    if (HG.settings.debug === true) {
        var axes = new HG.Entities.BaseEntity(new THREE.AxisHelper(500));
        axes.position(0, 0, 0);
        mainScene.add(axes);
    }

    game.start();
});

game.on("start", function () {
    game.scene(mainScene);
    HG.Utils.bootstrap(game);
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
    mainScene.forNamed(function (e) {
        return e.frame(delta);
    });
    $("fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
    $("verts").innerText = locale.debugInfo.verts.f(game.renderer.info.render.vertices);
    $("frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
});

window.onload = function () {
    return game.load();
};
//# sourceMappingURL=game.js.map
