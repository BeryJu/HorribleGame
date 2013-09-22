var Game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));

Game.On('PreLoad', function() {
	var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshBasicMaterial({color: 0x00ff00}));
	var Player = new HG.Entity({
		Position: new THREE.Vector3(0, 0, 0),
		Object: cube
	});
	var PlayerLight = new HG.Entity({
		Position: new THREE.Vector3(0, 0, 0),
		Object: new THREE.PointLight(0x00ff00, 3, 250)
	});
	Player.Connect(PlayerLight);
	Game.Scene.Add(Player);

	var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50),
			new THREE.MeshPhongMaterial({color: 0xababab}));
	var d = new HG.Entity({
		Position: new THREE.Vector3(0, -50, 0),
		Object: cube
	});
	Game.Scene.Add(d);
	Game.Camera.position.z = 250;
	Game.Camera.rotation.x = 75;
	Game.Camera.rotation.y = 75;
});

Game.On('start', function() {
	window.onresize = function() {Game.OnResize()};
	window.onkeydown = function(a: any) {Game.OnKeyDown(a)};
	window.onkeyup = function(a: any) {Game.OnKeyUp(a)};
	var r = function() {
		Game.Render();
		requestAnimationFrame(r);
	};
	r();
});

Game.Controls.Bind(HG.Settings.Keys.Esc, function(delta: number) {
	document.getElementById("menuWrapper").style.display = 'block';
	document.getElementById("gameWrapper").style.display = 'none';
});

Game.Controls.Bind(HG.Settings.Keys.A, function(delta: number) {
	Game.Scene.Get(0).position.x -= 0.3125 * delta[0];
	Game.Scene.Get(1).position.x -= 0.3125 * delta[0];
	Game.Camera.position.x -= 0.3125 * delta[0];
});

Game.Controls.Bind(HG.Settings.Keys.D, function(delta: number) {
	Game.Scene.Get(0).position.x += 0.3125 * delta[0];
	Game.Scene.Get(1).position.x += 0.3125 * delta[0];
	Game.Camera.position.x += 0.3125 * delta[0];
});

Game.On(['start', 'resize'], function() {
	document.getElementById("resolution").innerText = "Rendering on: "+window.innerWidth+"x"+window.innerHeight;
});

Game.On("render", function() {
	document.getElementById("fps").innerText = "FPS: "+Game.FPSCounter.getFPS();
	document.getElementById("frametime").innerText = "Frametime: "+Game.FPSCounter.getFrameTime()+"ms";
});



document.onreadystatechange = function() {
	if (document.readyState === "complete") {
		Game.PreLoad()
	}
};
document.getElementById("exit").onclick = function() {
	window.close();
};
document.getElementById("play").onclick = function() {
	document.getElementById("gameWrapper").style.display = 'block';
	document.getElementById("menuWrapper").style.display = 'none';
	if (Game.IsRunning === false) {
		Game.Start();
	}
};