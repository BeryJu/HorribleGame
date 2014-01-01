var MainScene;
(function (MainScene) {
    MainScene.WORLD_SIZE = 5000;

    function create(game, loader, done) {
        var scene = new HG.Core.Scene();

        scene.color = new THREE.Color(12307677);
        scene.colorAlpha = .5;

        var te = new HG.Entities.TextEntity("derp");
        te.position(10);
        scene.push(te);

        MainScene.createHeightMap(loader, function (e) {
            scene.push(e);
        });

        MainScene.createPlayer(loader, function (e) {
            scene.push(e);

            var moving = new HG.Abilities.MovingAbility(3.125);
            e.ability(moving);

            scene.controls.keyboard.bind(HG.settings.keys.jump, function (delta) {
                moving.jump(delta);
            });

            scene.controls.keyboard.bind(HG.settings.keys.forward, function (delta) {
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
            "textures/skyboxes/1/skyrender0001.png",
            "textures/skyboxes/1/skyrender0002.png",
            "textures/skyboxes/1/skyrender0003.png",
            "textures/skyboxes/1/skyrender0004.png",
            "textures/skyboxes/1/skyrender0005.png"
        ], function (textures) {
            console.log(textures.toValueArray());
            var entity = new HG.Entities.SkyBoxEntity(textures, MainScene.WORLD_SIZE);
            entity.name = "skybox";
            done(entity);
        });
    }
    MainScene.createSkyBox = createSkyBox;

    function createHeightMap(loader, done) {
        var paths = [
            "textures/map/bump.png",
            "textures/map/ocean.jpg",
            "textures/map/sandy.jpg",
            "textures/map/grass.jpg",
            "textures/map/rocky.jpg",
            "textures/map/snowy.jpg"
        ];
        loader.queueTexture(paths, function (textures) {
            var shader = loader.shader("shaders/heightmap.json");

            shader.extendTexture(textures).set("bumpScale", {
                type: "f",
                value: 200.0
            });
            var material = shader.toMaterial();
            var geometry = new THREE.PlaneGeometry(MainScene.WORLD_SIZE, MainScene.WORLD_SIZE, MainScene.WORLD_SIZE / 10, MainScene.WORLD_SIZE / 10);
            var entity = new HG.Entities.MeshEntity(geometry, material);
            entity.position(0, -100, 0).rotate((-Math.PI / 2), 0, 0);
            done(entity);
        });
    }
    MainScene.createHeightMap = createHeightMap;

    function createMap(loader, done) {
        var paths = [
            "textures/map/bump.png",
            "textures/map/ocean.jpg",
            "textures/map/sandy.jpg",
            "textures/map/grass.jpg",
            "textures/map/rocky.jpg",
            "textures/map/snowy.jpg"
        ];
        loader.queueTexture(paths, function (textures) {
            var shader = loader.shader("shaders/heightmap.json");

            shader.extendTexture(textures).set("bumpScale", {
                type: "f",
                value: 200.0
            });
            var material = shader.toMaterial();
            var geometry = new THREE.PlaneGeometry(MainScene.WORLD_SIZE, MainScene.WORLD_SIZE);
            var entity = new HG.Entities.MeshEntity(geometry, material);
            entity.position(0, -100, 0).rotate((-Math.PI / 2), 0, 0);
            done(entity);
        });
    }
    MainScene.createMap = createMap;

    function createExplosion(loader, done) {
        loader.texture("textures/explosion.png").on("loaded", function (texture) {
            var shader = loader.shader("shaders/fireball.json");
            shader.extendTexture(new HG.Core.Hash().push("explosion", texture));
            var material = shader.toMaterial();
            var geometry = new THREE.IcosahedronGeometry(20, 4);
            var entity = new HG.Entities.MeshEntity(geometry, material);
            entity.position(0, 10, 0);
            done(entity);
        });
    }
    MainScene.createExplosion = createExplosion;

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
var loader = new HG.Resource.Loader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var locale = loader.json("locale/game.locale.json");

if (HG.settings.debug === true) {
    HG.Utils.devTools();
}

game.on("loaded", function () {
    game.pluginHost.load(loader.directory("plugins", ".js"));
    MainScene.create(game, loader, function (scene) {
        game.scene(scene);
        scene.camera("mainCamera");
        game.start({
            mouseLock: true,
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
