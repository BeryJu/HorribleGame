var MainScene;
(function (MainScene) {
    function create(loader) {
        var scene = new HG.Scenes.Scene();

        scene.color = new THREE.Color(12307677);
        scene.colorAlpha = .5;

        var skybox = MainScene.createSkyBox(loader);
        scene.add(skybox);

        var heightmap = MainScene.createHeightMap(loader);
        scene.add(heightmap);

        var cam = new HG.Entities.FirstPersonCameraEntity(HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
        cam.name = "mainCamera";
        cam.offset(0, 25, -25).rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782).position(-27.512701511383057, 250, 211.5527195930481);

        var movingAbility = new HG.Abilities.MovingAbility(3.125);
        cam.ability(movingAbility);
        scene.add(cam);
        scene.camera("mainCamera");
        return scene;
    }
    MainScene.create = create;

    function createSkyBox(loader) {
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
        });
        return entity;
    }
    MainScene.createSkyBox = createSkyBox;

    function createHeightMap(loader) {
        var entity = new HG.Entities.MeshEntity();
        var geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        var textures = [
            "textures/map/heightmap.png",
            "textures/map/ocean-512.jpg",
            "textures/map/sandy-512.jpg",
            "textures/map/grass-512.jpg",
            "textures/map/rocky-512.jpg",
            "textures/map/snowy-512.jpg"
        ];
        loader.queueTexture(textures, function (textures) {
            var params = loader.shader("shaders/heightmap.json").extend({
                uniforms: {
                    bumpScale: 200,
                    bumpTexture: textures[0],
                    oceanTexture: textures[1],
                    sandyTexture: textures[2],
                    grassTexture: textures[3],
                    rockyTexture: textures[4],
                    snowyTexture: textures[5]
                }
            });
            console.log(params);
            var material = new THREE.ShaderMaterial(params);
            entity.object = new THREE.Mesh(geometry, material);
            entity.offset(0, -25, 0);
        });
        return entity;
    }
    MainScene.createHeightMap = createHeightMap;
})(MainScene || (MainScene = {}));
HG.horrible();

var gameCanvas = query("#canvasWrapper");
var loader = new HG.Resource.ResourceLoader("assets/");
var game = new HG.Core.BaseGame(gameCanvas);
var mainScene = new HG.Scenes.Scene();
var locale = loader.json("locale/game.locale.json");

if (HG.settings.debug === true) {
    HG.Utils.devTools();
}

game.on("load", function () {
    game.pluginHost.load(loader.directory("plugins", ".js"));
    mainScene = MainScene.create(loader);
    game.scene(mainScene);
    game.start({
        input: true,
        profileFrame: false,
        noResize: true
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
