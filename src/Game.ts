var Game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));

Game.on('PreLoad', function() {
	var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshBasicMaterial({color: 0x00ff00}));
	var Player = new HG.Entity({
		position: new THREE.Vector3(0, 0, 0),
		object: cube
	});
	var PlayerLight = new HG.Entity({
		position: new THREE.Vector3(0, 0, 0),
		object: new THREE.PointLight(0x00ff00, 3, 250)
	});
	Player.connect(PlayerLight);
	Game.scene.add(Player);

	var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshPhongMaterial({color: 0xababab}));
	var d = new HG.Entity({
		position: new THREE.Vector3(0, -50, 0),
		object: cube
	});
	Game.scene.add(d);
	Game.camera.position.z = 250;
	Game.camera.rotation.x = 75;
	Game.camera.rotation.y = 75;
});

Game.on('start', function() {
	window.onresize = function() {Game.onResize()};
	window.onkeydown = function(a: any) {Game.onKeyDown(a)};
	window.onkeyup = function(a: any) {Game.onKeyUp(a)};
	var r = function() {
		Game.render();
		requestAnimationFrame(r);
	};
	r();
});

Game.controls.bind(HG.Settings.keys.Esc, function(delta: number) {
	document.getElementById("menuWrapper").style.display = 'block';
	document.getElementById("gameWrapper").style.display = 'none';
});

Game.controls.bind(HG.Settings.keys.A, function(delta: number) {
	Game.scene.get(0).position.x -= 0.3125 * delta[0];
	Game.scene.get(1).position.x -= 0.3125 * delta[0];
	Game.camera.position.x -= 0.3125 * delta[0];
});

Game.controls.bind(HG.Settings.keys.D, function(delta: number) {
	Game.scene.get(0).position.x += 0.3125 * delta[0];
	Game.scene.get(1).position.x += 0.3125 * delta[0];
	Game.camera.position.x += 0.3125 * delta[0];
});

Game.on(['start', 'resize'], function() {
	document.getElementById("resolution").innerText = "Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

Game.on("render", function() {
	document.getElementById("fps").innerText = "FPS: "+Game.fpsCounter.getFPS();
	document.getElementById("frametime").innerText = "Frametime: "+Game.fpsCounter.getFrameTime()+"ms";
});

window.onload = function() {
	Game.preLoad();
};
document.getElementById("exit").onclick = function() {
	window.close();
};
document.getElementById("play").onclick = function() {
	document.getElementById("gameWrapper").style.display = 'block';
	document.getElementById("menuWrapper").style.display = 'none';
	if (Game.isRunning === false) {
		Game.start();
	}
};