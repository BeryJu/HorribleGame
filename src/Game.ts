var pkg = require("./package.json");
console.log("[HorribleGame] Build "+pkg.build);
var game = new HG.BaseGame(document.getElementById("gameWrapper"));
// game.loadShader('assets/shaders/heightmap.js')
var scene = new HG.Scenes.BaseScene();
game.on('load', function() {

	game.renderer.setClearColor(new THREE.Color(0x000000), .5);

	// game.camera.addAbility(new HG.Abilities.MovingAbility());
	// scene.add(game.camera, "camera1");

	var playerLight = new HG.BaseEntity(
		new THREE.PointLight(0xffffff, 3, HG.Settings.Graphics.viewDistance / 10));
	var playerLightMove = new HG.Abilities.MovingAbility();
	playerLight.addAbility(playerLightMove);
	playerLight.offset(0, 150, 0);
	// playerLight.rotate(0, HG.Utils.degToRad(90), 0);
	scene.add(playerLight, "playerLight");

	// //create a skybox for demo purposes
	// var skyBox = new HG.Entities.SkyBoxEntity("app://hg/assets/textures/skybox/",
	// 			HG.Settings.viewDistance * 1.75);
	// //add moving ability so it's fixed to the camera
	// skyBox.addAbility(new HG.Abilities.MovingAbility());
	// //add it to the scene
	// scene.add(skyBox, "skyBox");

	var player = new HG.Entities.ModelEntity();
	var playerMove = new HG.Abilities.MovingAbility();
	player.addAbility(playerMove);
	var animationAbility = new HG.Abilities.AnimationAbility();
	player.addAbility(animationAbility);
	player.on('loaded', () => {
		player.scale(10, 10, 10);
		player.offset(0, 0, 50);
		// player.rotate(0, HG.Utils.degToRad(90), 0);
		scene.forNamed((e) => e.position(0, 0, 0));
		scene.add(player, "player");
	});
	player.fromJS("assets/models/android.js");

	var room = new HG.Entities.ModelEntity();
	room.on('loaded', () => {
		room.scale(5, 5, 5);
		room.position(0, 0, 0);
		room.rotate(HG.Utils.degToRad(90), 0, 0);
		scene.add(room);
	});
	// room.fromSTL("assets/models/room01.js");


	var levelStruct = new HG.LevelStructure();
	levelStruct.on(['loaded', 'created'], (args: {}) => {
		var level = new HG.Level(args['level']);
		level.entities.forEach((e) => {
			scene.add(e);
		});
		var cam = new HG.Entities.ChasingCameraEntity(player, HG.Settings.Graphics.fov,
					window.innerWidth / window.innerHeight, 0.1, HG.Settings.Graphics.viewDistance);
		level.applyCameraOffset(cam);
		game.camera = cam;
	});
	// levelStruct.loadAsync("assets/levels/level1.json");
	levelStruct.create();

	if (HG.Settings.debug === true) {
		var axes = new HG.BaseEntity(new THREE.AxisHelper(500));
		axes.position(0, 0, 0)
		scene.add(axes);
	}

	game.controls.bind(HG.Settings.keys.left, (delta: number) => {
		playerLightMove.turnLeft(3.125 * delta);
		playerMove.turnLeft(3.125 * delta);
		// if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
	});

	game.controls.bind(HG.Settings.keys.right, (delta: number) => {
		playerLightMove.turnRight(3.125 * delta);
		playerMove.turnRight(3.125 * delta);
		// if (a instanceof HG.Abilities.AnimationAbility) a.running = true;
	});

	game.controls.bind(HG.Settings.keys.forward, (delta: number) => {
		playerLightMove.moveForward(3.125 * delta);
		playerMove.moveForward(3.125 * delta);
		animationAbility.running = true;
	});

	game.controls.bind(HG.Settings.keys.backward, (delta: number) => {
		playerLightMove.moveBackward(3.125 * delta);
		playerMove.moveBackward(3.125 * delta);
		animationAbility.running = true;
	});

	game.controls.bind(HG.Settings.keys.lower, (delta: number) => {
		playerLightMove.lower(3.125 * delta);
		playerMove.lower(3.125 * delta);
		animationAbility.running = true;
	});

	game.controls.bind(HG.Settings.keys.jump, (delta: number) => {
		playerLightMove.jump();
		playerMove.jump();
		animationAbility.running = true;
	});


});

game.on('start', () => {
	document.getElementById('build').innerText = "HorribleGame build "+pkg.build; 
	if (HG.Settings.debug === true) {
		HG.Utils.profile(() => {
			game.render(scene);
		});
	}
	window.onresize = () => game.onResize();
	window.onkeydown = (a: any) => game.onKeyDown(a);
	window.onkeyup = (a: any) => game.onKeyUp(a);
	window.onmousemove = (a: any) => game.onMouseMove(a);
	window.onmousedown = (a: any) => game.onMouseDown(a);
	window.onmouseup = (a: any) => game.onMouseUp(a);
	if (HG.Settings.Graphics.useStaticFramerate === true) {
		var render = () => { game.render(scene); };
		setInterval(render, 1000 / HG.Settings.Graphics.staticFramerate);
		render();
	} else {
		var render = () => { game.render(scene); requestAnimationFrame(render); };
		render();
	}
});

game.on('keydown', (a: any) => {
	a = <KeyboardEvent> a;
	if ("keyboard"+a.keyCode === HG.Settings.keys.devConsole) {
		HG.Utils.openDevConsole();
	}
});

game.controls.bind("mouseMove", (x: number, y: number) => {
	game.title("x: ", x, ", y: ", y);
});

game.controls.bind(HG.Settings.keys.refresh, (delta: number) => {
	HG.Utils.reload();
});

game.controls.bind(HG.Settings.keys.fullscreen, (delta: number) => {
	HG.Utils.toggleFullScreenMode();
});

game.on(['start', 'resize'], () => {
	document.getElementById("resolution").innerText = 
		"Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

game.on("connected", (host) => {
	document.getElementById("server").innerText = "Connected to "+host;
});

game.on("render", (delta: number) => {
	scene.forNamed((e) => e.frame(delta));
	document.getElementById("fps").innerText = "FPS: "+game.fpsCounter.FPS;
	document.getElementById("verts").innerText = "Vertices: "+game.renderer.info.render.vertices;
	document.getElementById("frametime").innerText =
		"Frametime: "+game.fpsCounter.frameTime+"ms";
});

window.onload = () => game.load();

var srv = new HG.BaseServer(9898);

if (game.isRunning === false) {
	game.start("http://localhost:9898");
}