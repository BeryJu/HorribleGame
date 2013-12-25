var MainScene;
(function (MainScene) {
    function create(loader, done) {
        var scene = new HG.Scenes.Scene();

        scene.color = new THREE.Color(12307677);
        scene.colorAlpha = .5;

        MainScene.createSkyBox(loader, function (skybox) {
            scene.push(skybox);
        });

        MainScene.createPlayer(loader, function (e) {
            scene.push(e);

            var moving = new HG.Abilities.MovingAbility(3.125);
            e.ability(moving);

            scene.controls.keyboard.bind(HG.settings.keys.forward, function (delta) {
                moving.moveForward(delta);
            });

            var cam = new HG.Entities.ChasingCameraEntity(e, HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
            cam.name = "mainCamera";
            cam.offset(0, 25, -25).rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782).position(-27.512701511383057, 250, 211.5527195930481);
            scene.push(cam);
            done(scene);
        });
    }
    MainScene.create = create;

    function createSkyBox(loader, done) {
        var textures = [
            "textures/skybox/xpos.png",
            "textures/skybox/xneg.png",
            "textures/skybox/ypos.png",
            "textures/skybox/yneg.png",
            "textures/skybox/zpos.png",
            "textures/skybox/zneg.png"
        ];
        var entity;
        loader.queueTexture(textures, function (textures) {
            entity = new HG.Entities.SkyBoxEntity(textures);
            done(entity);
        });
    }
    MainScene.createSkyBox = createSkyBox;

    function createPlayer(loader, done) {
        var entity = new HG.Entities.MeshEntity();
        loader.model("models/sledge.stl").on("loaded", function (geometry) {
            var phong = new THREE.MeshPhongMaterial({
                ambient: 0xff5533,
                color: 0xff5533,
                specular: 0x111111,
                shininess: 200
            });
            var material = new THREE.MeshFaceMaterial([phong]);
            entity.object = new THREE.Mesh(geometry, material);
            entity.rotate((45).toRadian(), 0, 0);

            done(entity);
        });
    }
    MainScene.createPlayer = createPlayer;
})(MainScene || (MainScene = {}));
HG.horrible();

var gameCanvas = query("#canvasWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var locale = loader.json("locale/game.locale.json");

if (HG.settings.debug === true) {
    HG.Utils.devTools();
}

game.on("load", function () {
    game.pluginHost.load(loader.directory("plugins", ".js"));
    MainScene.create(loader, function (scene) {
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
