HG.horrible();
var game = new HG.Core.BaseGame(document.getElementById("gameWrapper"), "settings.json");
var mainScene = new HG.Scenes.BaseScene();
var loader = new HG.Resource.ResourceLoader("assets/");

game.pluginHost.load(loader.directory("plugins"));
game.on('load', function () {
    game.renderer.setClearColor(new THREE.Color(0x000000), .5);

    var playerLight = new HG.Entities.BaseEntity(new THREE.PointLight(0xffffff, 3, HG.settings.graphics.viewDistance / 10));
    playerLight.offset(0, 150, 0).position(0, 0, 0);
    mainScene.add(playerLight, "playerLight");

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

    if (HG.settings.debug === true) {
        var axes = new HG.Entities.BaseEntity(new THREE.AxisHelper(500));
        axes.position(0, 0, 0);
        mainScene.add(axes);
    }

    game.start();
});

game.on('start', function () {
    game.scene(mainScene);

    if (HG.settings.debug === true) {
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
    if (HG.settings.graphics.useStaticFramerate === true) {
        var render = function () {
            game.render();
        };
        setInterval(render, 1000 / HG.settings.graphics.staticFramerate);
        render();
    } else {
        var render = function () {
            game.render();
            requestAnimationFrame(render);
        };
        render();
    }
});

game.controls.keyboard.bind(HG.settings.keys.refresh, function (delta) {
    game.reload();
});

game.controls.keyboard.bind(HG.settings.keys.fullscreen, function (delta) {
    game.toggleFullScreenMode();
});

game.on(['start', 'resize'], function () {
});

game.on("render", function (delta) {
    mainScene.forNamed(function (e) {
        return e.frame(delta);
    });
});

window.onload = function () {
    return game.load();
};
//# sourceMappingURL=game.js.map
