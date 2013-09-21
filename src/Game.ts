var Game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));

Game.On('PreLoad', function() {
	var geometry = new THREE.CubeGeometry(50, 50, 50);
	var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	var cube = new THREE.Mesh(geometry, material);
	var Player = new HG.Entity({
		Position: new THREE.Vector3(0, 0, 0),
		Object: cube
	});
	var PlayerLight = new HG.Entity({
		Position: new THREE.Vector3(0, 0, 0),
		Object: new THREE.PointLight(0xffffff, 1, 100)
	});
	Player.Connect(PlayerLight);
	Game.Scene.add(Player);

	var g = new THREE.CubeGeometry(50, 50, 50);
	var m = new THREE.MeshPhongMaterial({color: 0xababab});
	var cube = new THREE.Mesh(g, m);
	var d = new HG.Entity({
		Position: new THREE.Vector3(50, -50, 0),
		Object: cube
	});
	Game.Scene.add(d);
	Game.Scene.add(new HG.Entity({
		Position: new THREE.Vector3(50, 50, 0),
		Object: cube
	}));
	Game.Camera.position.z = 250;
	Game.Camera.rotation.x = 75;
	Game.Camera.rotation.y = 75;
});

Game.On('start', function() {
	window.onresize = function() {Game.OnResize()};
	window.onkeydown = function(a: any) {Game.OnKeyDown(a)};
	window.onkeyup = function(a: any) {Game.OnKeyUp(a)};
	window.onkeypress = function(a: any) {Game.OnKeyPress(a)};
	var r = function() {
		Game.Render();
		requestAnimationFrame(r);
	};
	r();
});


Game.On('keydown', function(e) {
	if (e[0].keyCode === 27) {
		//esc key
		document.getElementById("menuWrapper").style.display = 'block';
		document.getElementById("gameWrapper").style.display = 'none';
	} else if (e[0].keyCode === 83) {
		Game.Camera.position.z -= 5;
	} else if (e[0].keyCode === 87) {
		Game.Camera.position.z += 5;
	} else {
		console.log(e[0].keyCode);
	}
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