/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 21:41:33
*/

module MainScene {

	export function create(loader: HG.Resource.ResourceLoader,
						done: (scene: HG.Core.Scene) => any): void {
		var scene = new HG.Core.Scene();

		scene.color = new THREE.Color(12307677);
		scene.colorAlpha = .5;

		// MainScene.createSkyBox(loader, (skybox: HG.Entities.MeshEntity) => {
		// 	scene.push(skybox);
		// });

		var te = new HG.Entities.TextEntity("derp");
		te.position(10);
		scene.push(te);

		loader.video("videos/sintel.ogv").on("loaded", (domElement: HTMLVideoElement) => {
			var entity = new HG.Entities.VideoEntity(domElement);
			entity.position(500, 0, 0);
			scene.push(entity);
			entity.play();
		});

		MainScene.createMap(loader, (e: HG.Entities.MeshEntity) => {
			scene.push(e);
		});

		MainScene.createExplosion(loader, (e: HG.Entities.MeshEntity) => {
			scene.push(e);
		});

		MainScene.createPlayer(loader, (e: HG.Entities.MeshEntity) => {
			scene.push(e);

			var moving = new HG.Abilities.MovingAbility(3.125);
			e.ability(moving);

			scene.controls.keyboard.bind(HG.settings.keys.jump, (delta: number) => {
				moving.jump(delta);
			});

			scene.controls.keyboard.bind(HG.settings.keys.forward, (delta: number) => {
				moving.moveForward(delta);
			});

			scene.controls.keyboard.bind(HG.settings.keys.backward, (delta: number) => {
				moving.moveBackward(delta);
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
		], (textures: HG.Core.Hash<string, THREE.Texture>) => {
			var entity = new HG.Entities.SkyBoxEntity(textures.toValueArray());
			entity.name = "skybox";
			done(entity);
		});
	}

	export function createMap(loader: HG.Resource.ResourceLoader,
						done: (e: HG.Entities.MeshEntity) => any): void {
		var paths = [
			"textures/map/bump.png",
			"textures/map/ocean.jpg",
			"textures/map/sandy.jpg",
			"textures/map/grass.jpg",
			"textures/map/rocky.jpg",
			"textures/map/snowy.jpg"
		];
		loader.queueTexture(paths, (textures: HG.Core.Hash<string, THREE.Texture>) => {
			var shader = loader.shader("shaders/heightmap.json");

			shader.extendTexture(textures).set("bumpScale", {
				type: "f",
				value: 200.0
			});
			var material = shader.toMaterial();
			var geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
			var entity = new HG.Entities.MeshEntity(geometry, material);
			entity.position(0, -100, 0).
					rotate((-Math.PI / 2), 0, 0);
			done(entity);
		});
	}

	export function createExplosion(loader: HG.Resource.ResourceLoader,
						done: (e: HG.Entities.MeshEntity) => any): void {
		loader.texture("textures/explosion.png").on("loaded", (texture: THREE.Texture) => {
			var shader = loader.shader("shaders/fireball.json");
			var textures = new HG.Core.Hash<string, THREE.Texture>();
			textures.push("explosion", texture);
			shader.extendTexture(textures);
			var material = shader.toMaterial();
			var geometry =  new THREE.IcosahedronGeometry(20, 4);
			var entity = new HG.Entities.MeshEntity(geometry, material);
			entity.position(0, 10, 0);
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