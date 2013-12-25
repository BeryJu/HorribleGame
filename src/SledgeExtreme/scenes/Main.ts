/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-25 12:20:03
*/

module MainScene {

	export function create(loader: HG.Resource.ResourceLoader,
						done: (scene: HG.Scenes.Scene) => any): void {
		var scene = new HG.Scenes.Scene();

		scene.color = new THREE.Color(12307677);
		scene.colorAlpha = .5;

		MainScene.createSkyBox(loader, (skybox: HG.Entities.MeshEntity) => {
			scene.push(skybox);
		});

		MainScene.createPlayer(loader, (e: HG.Entities.MeshEntity) => {
			scene.push(e);

			var moving = new HG.Abilities.MovingAbility(3.125);
			e.ability(moving);

			scene.controls.keyboard.bind(HG.settings.keys.forward, (delta: number) => {
				moving.moveForward(delta);
			});

			var cam = new HG.Entities.ChasingCameraEntity(
				e, HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
				0.1, HG.settings.graphics.viewDistance);
			cam.name = "mainCamera";
			cam.offset(0, 25, -25)
				.rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782)
				.position(-27.512701511383057, 250, 211.5527195930481);
			scene.push(cam);
			done(scene);
		});
	}

	export function createSkyBox(loader: HG.Resource.ResourceLoader,
						done: (e: HG.Entities.MeshEntity) => any): void {
		var textures = [
			"textures/skybox/xpos.png",
			"textures/skybox/xneg.png",
			"textures/skybox/ypos.png",
			"textures/skybox/yneg.png",
			"textures/skybox/zpos.png",
			"textures/skybox/zneg.png"
		];
		var entity;
		loader.queueTexture(textures, (textures: THREE.Texture[]) => {
			entity = new HG.Entities.SkyBoxEntity(textures);
			done(entity);
		});
	}

	export function createPlayer(loader: HG.Resource.ResourceLoader,
						done: (e: HG.Entities.MeshEntity) => any): void {
		var entity = new HG.Entities.MeshEntity();
		loader.model("models/sledge.stl").on("loaded", (geometry: THREE.Geometry) => {
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

}


// export function createPlayer(loader: HG.Resource.ResourceLoader): HG.Entities.MeshEntity {
// 	var

// 	var entity = new HG.Entities.MeshEntity();
// 	entity.name = "player";
// 	entity.on("loaded", () => {
// 		entity.scale(10).
// 				offset(0, 0, 50);
// 	});
// 	loader.model("models/android.js", entity);
// 	return entity;

// 	"type": "MeshEntity",
// 	"name": "player",
// 	"model": "models/android.js",
// 	"scale": 10,
// 	"offset": [0, 0, 50],
// 	"abilities": [
// 		{
// 			"type": "MovingAbility",
// 			"properties": [3.125],
// 			"bindings": {
// 				"keyboard": [
// 					{
// 						"event": "left",
// 						"action": "turnLeft",
// 						"properties": [
// 							"${delta}"
// 						]
// 					},
// 					{
// 						"event": "right",
// 						"action": "turnRight"
// 					},
// 					{
// 						"event": "forward",
// 						"action": "moveForward"
// 					},
// 					{
// 						"event": "backward",
// 						"action": "moveBackward"
// 					},
// 					{
// 						"event": "lower",
// 						"action": "lower"
// 					}
// 				]
// 			}
// 		},
// 		{
// 			"type": "AnimationAbility",
// 			"properties": [
// 				{
// 					"offset": 0,
// 					"duration": 1000,
// 					"keyframes": 20
// 				}
// 			],
// 			"bindings": {
// 				"keyboard": [
// 					{
// 						"event": "forward",
// 						"action": "run"
// 					},
// 					{
// 						"event": "backward",
// 						"action": "run"
// 					},
// 					{
// 						"event": "lower",
// 						"action": "run"
// 					}
// 				]
// 			}
// 		}
// 	]
// }