/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 12:23:11
*/

module MainScene {

	export function create(loader: HG.Resource.ResourceLoader,
						done: (scene: HG.Core.Scene) => any): void {
		var scene = new HG.Core.Scene();

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
				e.object.translateX(delta * 3.125);
			});

			scene.controls.keyboard.bind(HG.settings.keys.backward, (delta: number) => {
				e.object.translateX(-(delta * 3.125));
			});

			scene.controls.keyboard.bind(HG.settings.keys.left, (delta: number) => {
				moving.turnLeft(delta);
			});

			scene.controls.keyboard.bind(HG.settings.keys.right, (delta: number) => {
				moving.turnRight(delta);
			});

			var cam = new HG.Entities.ChasingCameraEntity(
				e, HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
				0.1, HG.settings.graphics.viewDistance);
			cam.name = "mainCamera";
			cam.offset(0, 25, -25);
			scene.push(cam);
			done(scene);
		});
	}

	export function createSkyBox(loader: HG.Resource.ResourceLoader,
						done: (e: HG.Entities.SkyBoxEntity) => any): void {
		loader.queueTexture([
			"textures/skybox/xpos.png",
			"textures/skybox/xneg.png",
			"textures/skybox/ypos.png",
			"textures/skybox/yneg.png",
			"textures/skybox/zpos.png",
			"textures/skybox/zneg.png"
		], (textures: THREE.Texture[]) => {
			var entity = new HG.Entities.SkyBoxEntity(textures);
			done(entity);
		});
	}

	export function createPlayer(loader: HG.Resource.ResourceLoader,
						done: (e: HG.Entities.MeshEntity) => any): void {
		loader.model("models/sledge.stl").on("loaded", (geometry: THREE.Geometry) => {
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