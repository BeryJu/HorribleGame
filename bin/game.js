HG.horrible();
var game = new HG.BaseGame(document.getElementById("gameWrapper"), "settings.json");
var scene = new HG.BaseScene();
var loader = new HG.ResourceLoader("assets/");

// var srv = new HG.BaseServer(9898);
// game.pluginHost.load(loader.directory("plugins"));
game.on('load', function () {
    game.renderer.setClearColor(new THREE.Color(0x000000), .5);

    // game.camera.ability(new HG.Abilities.MovingAbility());
    // scene.add(game.camera, "camera1");
    var playerLight = new HG.BaseEntity(new THREE.PointLight(0xffffff, 3, HG.Settings.Graphics.viewDistance / 10));
    var playerLightMove = new HG.Abilities.MovingAbility();
    playerLight.ability(playerLightMove);
    playerLight.offset(0, 150, 0).position(0, 0, 0);

    // playerLight.rotate(0, HG.Utils.degToRad(90), 0);
    scene.add(playerLight, "playerLight");

    // var particles = new HG.Entities.ParticleEntity("assets/textures/particle.png");
    // scene.add(particles, "particles");
    // //create a skybox for demo purposes
    // var skyBox = new HG.Entities.SkyBoxEntity("app://hg/assets/textures/skybox/",
    // 			HG.Settings.viewDistance * 1.75);
    // //add moving ability so it's fixed to the camera
    // skyBox.ability(new HG.Abilities.MovingAbility());
    // //add it to the scene
    // scene.add(skyBox, "skyBox");
    var player = new HG.Entities.MeshEntity();
    var playerMove = new HG.Abilities.MovingAbility();
    player.ability(playerMove);
    var animationAbility = new HG.Abilities.AnimationAbility();
    player.ability(animationAbility);
    player.on('loaded', function () {
        player.scale(10, 10, 10).offset(0, 0, 50);
        scene.add(player, "player");
    });
    loader.fromJSModel("models/android.js", player);

    var sound1 = new HG.Sound.Effect(game.soundMixer.channel('effectsEnv'));
    loader.fromWAV("sounds/001.wav", sound1);

    var room = new HG.Entities.MeshEntity();
    room.on('loaded', function () {
        room.scale(5, 5, 5).offset(0, 0, 50).rotate((90).toRadian(), 0, 0);
        scene.add(room);
    });
    loader.fromSTL("models/room01.stl", room);

    var levelStruct = new HG.LevelStructure();
    levelStruct.on(['loaded', 'created'], function (args) {
        var level = new HG.Level(args['level']);
        level.entities.forEach(function (e) {
            scene.add(e);
        });
        var cam = new HG.Entities.ChasingCameraEntity(player, HG.Settings.Graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.Settings.Graphics.viewDistance);
        level.applyCameraOffset(cam);
        game.camera = cam;
    });

    // levelStruct.loadAsync("assets/levels/level1.json");
    levelStruct.create();

    if (HG.Settings.debug === true) {
        var axes = new HG.BaseEntity(new THREE.AxisHelper(500));
        axes.position(0, 0, 0);
        scene.add(axes);
    }

    scene.controls.bind(HG.Settings.Keys.left, function (delta) {
        playerLightMove.turnLeft(3.125 * delta);
        playerMove.turnLeft(3.125 * delta);
        // if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
    });

    scene.controls.bind(HG.Settings.Keys.right, function (delta) {
        playerLightMove.turnRight(3.125 * delta);
        playerMove.turnRight(3.125 * delta);
        // if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
    });

    scene.controls.bind(HG.Settings.Keys.forward, function (delta) {
        playerLightMove.moveForward(3.125 * delta);
        playerMove.moveForward(3.125 * delta);
        animationAbility.running = true;
    });

    scene.controls.bind(HG.Settings.Keys.backward, function (delta) {
        playerLightMove.moveBackward(3.125 * delta);
        playerMove.moveBackward(3.125 * delta);
        animationAbility.running = true;
    });

    scene.controls.bind(HG.Settings.Keys.lower, function (delta) {
        playerLightMove.lower(3.125 * delta);
        playerMove.lower(3.125 * delta);
        animationAbility.running = true;
    });

    scene.controls.bind(HG.Settings.Keys.jump, function (delta) {
        playerLightMove.jump();
        playerMove.jump();
        animationAbility.running = true;
    });
    game.start("http://localhost:9898");
});

game.on('start', function () {
    game.scene(scene);
    HG.Utils.bootstrap(game, window);
});

game.on('keyDown', function (a) {
    a = a;
    if (["keyboard" + a.keyCode] === HG.Settings.Keys.devConsole) {
        HG.Utils.openDevConsole();
    }
});

game.controls.bind(HG.Settings.Keys.refresh, function (delta) {
    HG.Utils.reload();
});

game.controls.bind(HG.Settings.Keys.fullscreen, function (delta) {
    HG.Utils.toggleFullScreenMode();
});

game.on(['start', 'resize'], function () {
    document.getElementById("resolution").innerText = "Rendering on: " + window.innerWidth + "x" + window.innerHeight;
});

game.on("connected", function (host) {
    document.getElementById("server").innerText = "Connected to " + host;
});

game.on("render", function (delta) {
    scene.forNamed(function (e) {
        return e.frame(delta);
    });
    document.getElementById("fps").innerText = "FPS: " + game.fpsCounter.FPS;
    document.getElementById("verts").innerText = "Vertices: " + game.renderer.info.render.vertices;
    document.getElementById("frametime").innerText = "Frametime: " + game.fpsCounter.frameTime + "ms";
});

window.onload = function () {
    return game.load();
};
//# sourceMappingURL=game.js.map
