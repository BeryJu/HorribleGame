HG.horrible();
var game = new HG.Core.BaseGame(document.getElementById("gameWrapper"), "settings.json");
var mainScene = new HG.Scenes.BaseScene();
var loader = new HG.Resource.ResourceLoader("assets/");

// var srv = new HG.BaseServer(9898);
// game.pluginHost.load(loader.directory("plugins"));
game.on('load', function () {
    game.renderer.setClearColor(new THREE.Color(0x000000), .5);

    var playerLight = new HG.Entities.BaseEntity(new THREE.PointLight(0xffffff, 3, HG.Settings.Graphics.viewDistance / 10));
    playerLight.offset(0, 150, 0).position(0, 0, 0);
    mainScene.add(playerLight, "playerLight");

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
    playerLight.ability(playerMove);

    var animationAbility = new HG.Abilities.AnimationAbility();
    player.ability(animationAbility);

    player.on('loaded', function () {
        player.scale(10, 10, 10).offset(0, 0, 50);
        mainScene.add(player, "player");
    });
    loader.model("models/android.js", player);

    var sound1 = new HG.Sound.Effect(game.soundMixer.channel('effectsEnv'));
    loader.sound("sounds/001.wav", sound1);

    var room = new HG.Entities.MeshEntity();
    room.on('loaded', function () {
        room.scale(5, 5, 5).offset(0, 0, 50).rotate((90).toRadian(), 0, 0);
        mainScene.add(room);
    });
    loader.model("models/room01.stl", room);

    if (HG.Settings.debug === true) {
        var axes = new HG.Entities.BaseEntity(new THREE.AxisHelper(500));
        axes.position(0, 0, 0);
        mainScene.add(axes);
    }

    game.start();
});

game.on('start', function () {
    game.scene(mainScene);

    if (HG.Settings.debug === true) {
        HG.Utils.profile(function () {
            game.render();
        });
    }
    window.onresize = function () {
        return game.onResize();
    };
    window.onkeydown = function (a) {
        return game.onKeyDown(a);
    };
    window.onkeyup = function (a) {
        return game.onKeyUp(a);
    };
    window.onmousemove = function (a) {
        return game.onMouseMove(a);
    };
    window.onmousedown = function (a) {
        return game.onMouseDown(a);
    };
    window.onmouseup = function (a) {
        return game.onMouseUp(a);
    };
    if (HG.Settings.Graphics.useStaticFramerate === true) {
        var render = function () {
            game.render();
        };
        setInterval(render, 1000 / HG.Settings.Graphics.staticFramerate);
        render();
    } else {
        var render = function () {
            game.render();
            requestAnimationFrame(render);
        };
        render();
    }
});

game.controls.keyboard.bind(HG.Settings.Keys.refresh, function (delta) {
    game.reload();
});

game.controls.keyboard.bind(HG.Settings.Keys.fullscreen, function (delta) {
    game.toggleFullScreenMode();
});

game.on(['start', 'resize'], function () {
    document.getElementById("resolution").innerText = "Rendering on: " + window.innerWidth + "x" + window.innerHeight;
});

game.on("render", function (delta) {
    mainScene.forNamed(function (e) {
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
