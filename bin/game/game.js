HG.horrible();

var gameCanvas = $("gameWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.BaseScene();
var locale = loader.json("locale/game.locale.json");

if (HG.settings.debug === true) {
    HG.Utils.devTools();
}

var player = new HG.Entities.MeshEntity();
var room = new HG.Entities.MeshEntity();
var sprite = new HG.Entities.SpriteEntity();
var cam = new HG.Entities.ChasingCameraEntity(player, HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
cam.offset(0, 25, -25).rotate(75, 75, 0);
mainScene.camera(cam);

game.pluginHost.load(loader.directory("plugins"));

game.on("load", function () {
    game.renderer.setClearColor(new THREE.Color(0x000000), 0.5);

    var playerMove = new HG.Abilities.MovingAbility();
    player.ability(playerMove);
    var playerLight = new HG.Entities.BaseEntity(new THREE.PointLight(0xffffff, 3, HG.settings.graphics.viewDistance / 10));
    playerLight.ability(playerMove);
    playerLight.offset(0, 150, 0).position(0, 0, 0);
    mainScene.add(playerLight, "playerLight");

    var animationAbility = new HG.Abilities.AnimationAbility();
    player.ability(animationAbility);
    player.on("loaded", function () {
        player.scale(10, 10, 10).offset(0, 0, 50);
        mainScene.add(player, "player");
    });
    loader.model("models/android.js", player);

    var effectsChannel = game.soundMixer.channel("effectsEnv");
    var sound1 = effectsChannel.effect();
    loader.sound("sounds/001.wav", sound1);

    var room = new HG.Entities.MeshEntity();
    room.on("loaded", function () {
        room.scale(5, 5, 5).offset(0, 0, 50).rotate((90).toRadian(), 0, 0);
        mainScene.add(room);
    });
    loader.model("models/room01.stl", room);

    mainScene.controls.keyboard.bind(HG.settings.keys.left, function (delta) {
        playerMove.turnLeft(3.125 * delta);
    });

    mainScene.controls.keyboard.bind(HG.settings.keys.right, function (delta) {
        playerMove.turnRight(3.125 * delta);
    });

    mainScene.controls.keyboard.bind(HG.settings.keys.forward, function (delta) {
        playerMove.moveForward(3.125 * delta);
        animationAbility.running = true;
    });

    mainScene.controls.keyboard.bind(HG.settings.keys.backward, function (delta) {
        playerMove.moveBackward(3.125 * delta);
        animationAbility.running = true;
    });

    mainScene.controls.keyboard.bind(HG.settings.keys.lower, function (delta) {
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
    $("fps").innerText = locale.debugInfo.fps.f(game.fpsCounter.FPS);
    $("verts").innerText = locale.debugInfo.verts.f(game.renderer.info.render.vertices);
    $("frametime").innerText = locale.debugInfo.frametime.f(game.fpsCounter.frameTime);
});

window.onload = function () {
    return game.load();
};
//# sourceMappingURL=game.js.map
