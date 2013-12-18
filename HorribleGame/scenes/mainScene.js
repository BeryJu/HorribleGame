define(["require", "exports"], function(require, exports) {
    function createMainScene(loader) {
        var scene = new HG.Scenes.BaseScene();

        scene.color = new THREE.Color(12307677);
        scene.colorAlpha = .5;

        var player = exports.createPlayer(loader);
        scene.add(player);

        var cam = new HG.Entities.ChasingCameraEntity(scene.entities.get("player"), HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
        cam.name = "mainCamera";
        cam.offset(0, 25, -25).rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782).position(-27.512701511383057, 250, 211.5527195930481);
        scene.add(cam);
        scene.camera("mainCamera");
        return scene;
    }
    exports.createMainScene = createMainScene;

    function createPlayer(loader) {
        var entity = new HG.Entities.MeshEntity();
        entity.name = "player";
        entity.on("loaded", function () {
            entity.scale(10).offset(0, 0, 50);
        });
        loader.model("models/android.js", entity);
    }
    exports.createPlayer = createPlayer;
});
