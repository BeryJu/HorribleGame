var Game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));

Game.on('PreLoad', function() {
	var Player = new HG.Entity({
		position: new THREE.Vector3(0, 0, 0),
		object: new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshBasicMaterial({color: 0x00ff00}))
	}).connect(new HG.Entity({
		position: new THREE.Vector3(0, 0, 0),
		object: new THREE.PointLight(0x00ff00, 3, 250)
	}));
	// var PlayerLight = ;
	// Player.connect(PlayerLight);
	Game.scene.add(Player);

	var d = new HG.Entity({
		position: new THREE.Vector3(0, -50, 0),
		object: new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshPhongMaterial({color: 0xababab}))
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

// var transition = new HG.ColorTransition()
// 				.from(new HG.rgb(0, 0, 0))
// 				.target(new HG.rgb(0, 255, 0))
// 				.target(new HG.rgb(255, 0, 0))
// 				.target(new HG.rgb(255, 255, 255))
// 				.over(1800);

Game.controls.bind(HG.Settings.keys.Esc, function(delta: number) {
	document.getElementById("menuWrapper").style.display = 'block';
	document.getElementById("gameWrapper").style.display = 'none';
});

Game.controls.bind(HG.Settings.keys.A, function(delta: number) {
	Game.scene.get(0).position.x -= 3.125 * delta[0];
	Game.scene.get(1).position.x -= 3.125 * delta[0];
	Game.camera.position.x -= 3.125 * delta[0];
});

Game.controls.bind(HG.Settings.keys.D, function(delta: number) {
	Game.scene.get(0).position.x += 3.125 * delta[0];
	Game.scene.get(1).position.x += 3.125 * delta[0];
	Game.camera.position.x += 3.125 * delta[0];
});

Game.controls.bind(HG.Settings.keys.S, function(delta: number) {
	Game.scene.get(0).position.z += 3.125 * delta[0];
	Game.scene.get(1).position.z += 3.125 * delta[0];
	Game.camera.position.z += 3.125 * delta[0];
});

Game.controls.bind(HG.Settings.keys.W, function(delta: number) {
	Game.scene.get(0).position.z -= 3.125 * delta[0];
	Game.scene.get(1).position.z -= 3.125 * delta[0];
	Game.camera.position.z -= 3.125 * delta[0];
});

Game.on(['start', 'resize'], function() {
	document.getElementById("resolution").innerText = 
		"Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

Game.on("render", function(delta: any[]) {
	// transition.frame(delta[0]);
	// var color = transition.getColor();
	// console.log(color);
	// Game.scene.get(0).material.color = color;
	// Game.scene.get(1).color = color;
	document.getElementById("fps").innerText = "FPS: "+Game.fpsCounter.getFPS();
	document.getElementById("frametime").innerText =
		"Frametime: "+Game.fpsCounter.getFrameTime()+"ms";
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