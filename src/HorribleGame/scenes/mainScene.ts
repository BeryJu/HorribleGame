/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 17:32:02
*/

export function createMainScene(loader: HG.Resource.ResourceLoader) {
	var scene = new HG.Scenes.BaseScene();

	scene.color = new THREE.Color(12307677);
	scene.colorAlpha = .5;

	var player = createPlayer(loader);
	scene.add(player);

	var cam = new HG.Entities.ChasingCameraEntity(
		<HG.Entities.MeshEntity> scene.entities.get("player"),
		HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
		0.1, HG.settings.graphics.viewDistance);
	cam.name = "mainCamera";
	cam.offset(0, 25, -25)
		.rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782)
		.position(-27.512701511383057, 250, 211.5527195930481);
	scene.add(cam);
	scene.camera("mainCamera");
	return scene;

}

export function createPlayer(loader: HG.Resource.ResourceLoader): HG.Entities.MeshEntity {
	var entity = new HG.Entities.MeshEntity();
	entity.name = "player";
	entity.on("loaded", () => {
		entity.scale(10).
				offset(0, 0, 50);
	});
	loader.model("models/android.js", entity);
	return entity;
	/*
	"type": "MeshEntity",
	"name": "player",
	"model": "models/android.js",
	"scale": 10,
	"offset": [0, 0, 50],
	"abilities": [
		{
			"type": "MovingAbility",
			"properties": [3.125],
			"bindings": {
				"keyboard": [
					{
						"event": "left",
						"action": "turnLeft",
						"properties": [
							"${delta}"
						]
					},
					{
						"event": "right",
						"action": "turnRight"
					},
					{
						"event": "forward",
						"action": "moveForward"
					},
					{
						"event": "backward",
						"action": "moveBackward"
					},
					{
						"event": "lower",
						"action": "lower"
					}
				]
			}
		},
		{
			"type": "AnimationAbility",
			"properties": [
				{
					"offset": 0,
					"duration": 1000,
					"keyframes": 20
				}
			],
			"bindings": {
				"keyboard": [
					{
						"event": "forward",
						"action": "run"
					},
					{
						"event": "backward",
						"action": "run"
					},
					{
						"event": "lower",
						"action": "run"
					}
				]
			}
		}
	] */
}