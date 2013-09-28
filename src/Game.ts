var game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));

game.on('preload', function() {
	var Player = new HG.Entities.MovingEntity({
		position: new THREE.Vector3(-75, 0, 0),
		object: new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshBasicMaterial({color: 0x00ff00}))
	});
	var PlayerLight = new HG.Entities.MovingEntity({
		position: new THREE.Vector3(0, 0, 0),
		object: new THREE.PointLight(0x00ff00, 3, 250)
	});
	game.scene.add(Player, "Player");
	game.scene.add(PlayerLight, "PlayerLight");
	var d = new HG.Entity({
		position: new THREE.Vector3(0, -50, 0),
		object: new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshPhongMaterial({color: 0xababab}))
	});
	game.scene.add(d);
	game.camera.position.z = 250;
	game.camera.position.x = -75;
	game.camera.rotation.x = 75;
	game.camera.rotation.y = 75;
});

game.on('start', function() {
	document.getElementById('three').innerText = "Three.js Revision "+ THREE.REVISION; 
	window.onresize = function() {game.onResize()};
	window.onkeydown = function(a: any) {game.onKeyDown(a)};
	window.onkeyup = function(a: any) {game.onKeyUp(a)};
	var r = function() {
		game.render();
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

game.controls.bind(HG.Settings.keys.pause, function(delta: number) {
	document.getElementById("menuWrapper").style.display = 'block';
	document.getElementById("gameWrapper").style.display = 'none';
});

game.controls.bind(HG.Settings.keys.left, function(delta: number) {
	game.scene.get(["Player", "PlayerLight"], HG.Entities.MovingEntity).forEach(function(e) {
		e.MoveLeft(3.125 * delta[0]);
	});
	game.camera.position.x -= 3.125 * delta[0];
});

game.controls.bind(HG.Settings.keys.jump, function(delta: number) {
	game.scene.get(["Player", "PlayerLight"],HG.Entities.MovingEntity).forEach(function(e) {
		e.Jump(3.125 * delta[0]);
	});
});

game.controls.bind(HG.Settings.keys.right, function(delta: number) {
	game.scene.get(["Player", "PlayerLight"], HG.Entities.MovingEntity).forEach(function(e) {
		e.MoveRight(3.125 * delta[0]);
	});
	game.camera.position.x += 3.125 * delta[0];
});

game.on(['start', 'resize'], function() {
	document.getElementById("resolution").innerText = 
		"Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

game.on("render", function(delta: any[]) {
	document.getElementById("fps").innerText = "FPS: "+game.fpsCounter.getFPS();
	document.getElementById("frametime").innerText =
		"Frametime: "+game.fpsCounter.getFrameTime()+"ms";
});

window.onload = function() {
	game.preLoad();
};
document.getElementById("exit").onclick = function() {
	window.close();
};
document.getElementById("play").onclick = function() {
	document.getElementById("gameWrapper").style.display = 'block';
	document.getElementById("menuWrapper").style.display = 'none';
	if (game.isRunning === false) {
		game.start();
	}
};