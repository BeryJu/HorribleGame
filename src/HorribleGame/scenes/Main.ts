/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 23:02:45
*/

module MainScene {

	export function create(loader: HG.Resource.ResourceLoader): HG.Scenes.Scene {
		var scene = new HG.Scenes.Scene();

		scene.color = new THREE.Color(12307677);
		scene.colorAlpha = .5;

		var skybox = MainScene.createSkyBox(loader);
		scene.push(skybox);

		// var heightmap = MainScene.createHeightMap(loader);
		// scene.push(heightmap);

		var cam = new HG.Entities.FirstPersonCameraEntity(
			HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
			0.1, HG.settings.graphics.viewDistance);
		cam.name = "mainCamera";
		cam.offset(0, 25, -25)
			.rotate(-0.9631355494204247, -0.5329935895199441, -0.6309911466206782)
			.position(-27.512701511383057, 250, 211.5527195930481);
		scene.push(cam);
		scene.controls.mouse.bind("move", (x: number, y: number) => {
			cam.onMouseMove(x, y);
		});

		scene.camera("mainCamera");
		return scene;

	}

	export function createSkyBox(loader: HG.Resource.ResourceLoader): HG.Entities.MeshEntity {
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
		});
		return entity;
	}

	export function createHeightMap(loader: HG.Resource.ResourceLoader): HG.Entities.MeshEntity {
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
		loader.queueTexture(textures, (textures: THREE.Texture[]) => {
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
			var material = new THREE.ShaderMaterial(params);
			entity.object = new THREE.Mesh(geometry, material);
			entity.offset(0, -25, 0);
		});
		return entity;
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