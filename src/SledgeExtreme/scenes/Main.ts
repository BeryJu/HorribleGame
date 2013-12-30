/*
* @Author: BeryJu
* @Date:   2013-12-17 10:40:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 20:34:50
*/

module MainScene {

	export var WORLD_SIZE: number = 5000;

	export function create(game: HG.Core.BaseGame,
						loader: HG.Resource.Loader,
						done: (scene: HG.Core.Scene) => any): void {
		var scene = new HG.Core.Scene();

		scene.color = new THREE.Color(12307677);
		scene.colorAlpha = .5;

		// var fog = new THREE.Fog(0xffffff, 10, 60);
		// fog.color.setHSL( 0.51, 0.6, 0.6 );
		// scene.fog = fog;

		// MainScene.createSkyBox(loader, (skybox: HG.Entities.MeshEntity) => {
		// 	scene.push(skybox);
		// });

		var te = new HG.Entities.TextEntity("derp");
		te.position(10);
		scene.push(te);

		MainScene.createHeightMap(loader, (e: HG.Entities.MeshEntity) => {
			scene.push(e);
		});

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

		MainScene.createPlayer(loader, (e: HG.Entities.MeshEntity) => {
			scene.push(e);
			// var playerSound = new HG.Sound.Effect(fxChannel);
			// loader.sound("sounds/001.wav").on("loaded", (buffer) => {
			// 	playerSound.create(buffer);
			// });

			var moving = new HG.Abilities.MovingAbility(3.125);
			e.ability(moving);

			scene.controls.keyboard.bind(HG.settings.keys.jump, (delta: number) => {
				moving.jump(delta);
			});

			scene.controls.keyboard.bind(HG.settings.keys.forward, (delta: number) => {
				moving.moveForward(delta);
				// playerSound.play();
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