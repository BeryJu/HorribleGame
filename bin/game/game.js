var MainScene;
(function (MainScene) {
    function create(loader, done) {
        var scene = new HG.Core.Scene();

        scene.color = new THREE.Color(12307677);
        scene.colorAlpha = .5;

        MainScene.createSkyBox(loader, function (skybox) {
            scene.push(skybox);
        });

        var te = new HG.Entities.TextEntity("derp");
        te.position(10);
        scene.push(te);

        loader.video("videos/sintel.ogv").on("loaded", function (domElement) {
            var entity = new HG.Entities.VideoEntity(domElement);
            entity.position(500, 0, 0);
            scene.push(entity);
            entity.play();
        });

        MainScene.createPlayer(loader, function (e) {
            scene.push(e);

            var moving = new HG.Abilities.MovingAbility(3.125);
            e.ability(moving);

            scene.controls.keyboard.bind(HG.settings.keys.forward, function (delta) {
                console.log(delta);
                moving.moveForward(delta);
            });

            scene.controls.keyboard.bind(HG.settings.keys.backward, function (delta) {
                moving.moveBackward(delta);
            });

            scene.controls.keyboard.bind(HG.settings.keys.left, function (delta) {
                moving.turnLeft(delta);
            });

            scene.controls.keyboard.bind(HG.settings.keys.right, function (delta) {
                moving.turnRight(delta);
            });

            var cam = new HG.Entities.ChasingCameraEntity(e, HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
            cam.name = "mainCamera";
            cam.offset(0, 25, -25);
            scene.push(cam);
            done(scene);
        });
    }
    MainScene.create = create;

    function createSkyBox(loader, done) {
        loader.queueTexture([
            "textures/skybox/xpos.png",
            "textures/skybox/xneg.png",
            "textures/skybox/ypos.png",
            "textures/skybox/yneg.png",
            "textures/skybox/zpos.png",
            "textures/skybox/zneg.png"
        ], function (textures) {
            var entity = new HG.Entities.SkyBoxEntity(textures);
            done(entity);
        });
    }
    MainScene.createSkyBox = createSkyBox;

    function createPlayer(loader, done) {
        loader.model("models/sledge.stl").on("loaded", function (geometry) {
            var phong = new THREE.MeshPhongMaterial({
                ambient: 0xff5533,
                color: 0xff5533,
                specular: 0x111111,
                shininess: 200
            });
            var material = new THREE.MeshFaceMaterial([phong]);
            var entity = new HG.Entities.MeshEntity();
            entity.object = new THREE.Mesh(geometry, material);
            entity.name = "player";
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
    game.title = game.fpsCounter.FPS + " " + game.fpsCounter.frameTime;
});

window.onload = function () {
    return game.load();
};
