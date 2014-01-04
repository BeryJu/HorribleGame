/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 17:40:08
*/

module MainScene {

	export var WORLD_SIZE: number = 5000;

	export function create(game: HG.Core.BaseGame,
						loader: HG.Resource.Loader,
						done: (scene: HG.Core.Scene) => any): void {
		var sceneLoader = new HG.Resource.SceneLoader();
		sceneLoader.color = new THREE.Color(12307677);
		sceneLoader.colorAlpha = .5;

		// sceneLoader.step((done: Function) => {
		// 	MainScene.createSkyBox(loader, (skybox: HG.Entities.MeshEntity) => {
		// 		done(skybox);
		// 	});
		// });

		sceneLoader.step((done: Function) => {
			MainScene.createHeightMap(loader, (e: HG.Entities.MeshEntity) => {
				done(e);
			});
		});

		var player: HG.Entities.MeshEntity;

		sceneLoader.step((done: Function) => {
			MainScene.createPlayer(loader, (e: HG.Entities.MeshEntity) => {
				player = e;
				var moving = new HG.Abilities.MovingAbility(3.125);
				e.ability(moving);

				sceneLoader.scene.controls.keyboard.bind(HG.settings.keys.jump, (delta: number) => {
					moving.jump(delta);
				});

				sceneLoader.scene.controls.keyboard.bind(HG.settings.keys.forward, (delta: number) => {
					moving.moveForward(delta);
					// playerSound.play();
				});

				sceneLoader.scene.controls.keyboard.bind(HG.settings.keys.backward, (delta: number) => {
					moving.moveBackward(delta);
				});

				sceneLoader.scene.controls.keyboard.bind(HG.settings.keys.left, (delta: number) => {
					moving.turnLeft(delta);
				});

				sceneLoader.scene.controls.keyboard.bind(HG.settings.keys.right, (delta: number) => {
					moving.turnRight(delta);
				});


				var cam = new HG.Entities.ChasingCameraEntity(
					player, HG.settings.graphics.fov, window.innerWidth / window.innerHeight,
					0.1, HG.settings.graphics.viewDistance);
				cam.name = "mainCamera";
				cam.offset(0, 25, -25);

				sceneLoader.scene.push(cam);

				done(player);
			});
		});

		sceneLoader.on("progress", (queue: HG.Core.Queue<number, HG.Entities.Entity>) => {
			"${0}% loaded".f(queue.percentage).log();
		});

		sceneLoader.on("done", (scene: HG.Core.Scene, duration: Date) => {
			"Loading duration: ${0}:${1} mins".
				f(duration.getMinutes(), duration.getSeconds()).log();
			done(scene);
		});
		sceneLoader.start();

		// loader.video("videos/sintel.ogv").on("loaded", (domElement: HTMLVideoElement) => {
		// 	var entity = new HG.Entities.VideoEntity(domElement);
		// 	entity.position(500, 0, 0);
		// 	scene.push(entity);
		// 	entity.play();
		// });

		// MainScene.createExplosion(loader, (e: HG.Entities.MeshEntity) => {
		// 	scene.push(e);
		// });

		// var fxChannel = game.soundMixer.channel("effectsEnv");
	}

	export function createSkyBox(loader: HG.Resource.Loader,
						done: (e: HG.Entities.SkyBoxEntity) => any): void {
		loader.queueTexture([
			"textures/skyboxes/1/skyrender0001.png",
			"textures/skyboxes/1/skyrender0002.png",
			"textures/skyboxes/1/skyrender0003.png",
			"textures/skyboxes/1/skyrender0004.png",
			"textures/skyboxes/1/skyrender0005.png"
		], (textures: HG.Core.Hash<string, THREE.Texture>) => {
			console.log(textures.toValueArray());
			var entity = new HG.Entities.SkyBoxEntity(textures, MainScene.WORLD_SIZE);
			entity.name = "skybox";
			done(entity);
		});
	}

	export function createHeightMap(loader: HG.Resource.Loader,
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
			var geometry = new THREE.PlaneGeometry(MainScene.WORLD_SIZE, MainScene.WORLD_SIZE,
					MainScene.WORLD_SIZE / 10, MainScene.WORLD_SIZE / 10);
			var entity = new HG.Entities.MeshEntity(geometry, material);
			entity.position(0, -100, 0).
					rotate((-Math.PI / 2), 0, 0);
			done(entity);
		});
	}

	export function createMap(loader: HG.Resource.Loader,
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

			shader.extendTexture(textures).
					set("bumpScale", {
				type: "f",
				value: 200.0
			});
			var material = shader.toMaterial();
			var geometry = new THREE.PlaneGeometry(MainScene.WORLD_SIZE, MainScene.WORLD_SIZE);
			var entity = new HG.Entities.MeshEntity(geometry, material);
			entity.position(0, -100, 0).
					rotate((-Math.PI / 2), 0, 0);
			done(entity);
		});
	}

	export function createExplosion(loader: HG.Resource.Loader,
						done: (e: HG.Entities.MeshEntity) => any): void {
		loader.texture("textures/explosion.png").on("loaded", (texture: THREE.Texture) => {
			var shader = loader.shader("shaders/fireball.json");
			shader.extendTexture(
				new HG.Core.Hash<string, THREE.Texture>().push("explosion", texture));
			var material = shader.toMaterial();
			var geometry =  new THREE.IcosahedronGeometry(20, 4);
			var entity = new HG.Entities.MeshEntity(geometry, material);
			entity.position(0, 10, 0);
			done(entity);
		});
	}

	export function createPlayer(loader: HG.Resource.Loader,
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