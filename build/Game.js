var Scene = new THREE.Scene();
var Renderer = new THREE.WebGLRenderer({antialias: Settings.Antialiasing});
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.setClearColor(0x000000, 1);
document.body.appendChild(Renderer.domElement);

var Camera = new THREE.PerspectiveCamera(Settings.FOV,
	window.innerWidth / window.innerHeight, 0.1, Settings.ViewDistance);
Camera.position = new THREE.Vector3(0, 200, 180);
Camera.rotation.x = 50;
Camera.rotation.y = 50;


// var controls = new THREE.TrackballControls(Camera);
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;
// controls.noZoom = false;
// controls.noPan = false;
// controls.staticMoving = true;
// controls.dynamicDampingFactor = 0.3;
// controls.keys = [ 65, 83, 68 ];
// controls.addEventListener( 'change', render );
// function animate() {
// 	requestAnimationFrame(animate);
// 	controls.update();
// }
// function render() {
// 	Renderer.render(Scene, Camera);
// }
// animate();


var res = Level.Load(Level.Create(Level.LevelPattern));
res.Entities.each(function(e) {
	e._Object.each(function(o) {
		Scene.add(o);
	});
});
var g = new THREE.CubeGeometry(50, 50, 50);
var m = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	shading: THREE.SmoothShading
});
var player = Entity.CreateEntity({
	Position: res.Start,
	_Object: [new THREE.Mesh(g, m), new THREE.PointLight(0x00ff00, 1, 500)]
});
player._Object.each(function(o) {
	Scene.add(o);
});
Camera.position.x = res.Start.x;
var color = [15, 30, 60];
var index = 0;

var colorize = function() {
	if (color[index] < 255) {
		color[index] += 1;
	} else if (color[index] >= 255 || color[0] >= 255) {
		if (index < color.length) {
			index++;
		}
	}
	var c = new THREE.Color();
	c.r = color[0] / 255;
	c.g = color[1] / 255;
	c.b = color[2] / 255;
	player._Object.each(function(o) {
		if (o.material) {
			o.material.color = c;
		} else {
			o.color = c;
		}
	});
}
var maxY = 100;

//jumpstate:
//0: idle
//1: jumping (upwards)
//2: jumping (falling)
//3: reset

var render = function() {
	colorize();
	if (player.jumpState >= 1) {
		if (player.jumpState === 3) {
			player.oldY = player._Object[0].position.y;
			player.jumpState = 0;
		}
		if (player._Object[0].position.y < (maxY + player.oldY)
				&& player.jumpState === 1) {
			player._Object[0].position.y += 1;
		}
		if (player._Object[0].position.y === (maxY + player.oldY)
				&& player.jumpState >= 1) {
			player.jumpState = 2;
		}
		if (player._Object[0].position.y <= player.oldY
				&& player.jumpState >= 2) {
			player._Object[0].position.y = player.oldY;
			player.jumpState = 3;
		} else if (player.jumpState >= 2) {
			player._Object[0].position.y -= 1;
		}
	}
	requestAnimationFrame(render);
	Renderer.render(Scene, Camera);
};

window.onkeypress = function(a) {
	if (a.keyCode === Settings.Keys.A) {
		player._Object.each(function(o) {
			o.position.x -= 5;
		});
		Camera.position.x -= 10;
	} else if (a.keyCode === Settings.Keys.D) {
		player._Object.each(function(o) {
			o.position.x += 5;
		});
		Camera.position.x += 10;
	} else if (a.keyCode === Settings.Keys.W) {
		player._Object.each(function(o) {
			o.position.y += 5;
		});
		Camera.position.y += 10;
	} else if (a.keyCode === Settings.Keys.S) {
		player._Object.each(function(o) {
			o.position.y -= 5;
		});
		Camera.position.y -= 10;
	} else if (a.keyCode === Settings.Keys.Space) {
		player.oldY = player._Object[0].position.y;
		player.jumpState = 1;
	}
};

window.onresize = function () {
	//Entities.each(function(e) {
	//	e.OnResize(e);
	//});
	Camera.aspect = window.innerWidth / window.innerHeight;
	Camera.updateProjectionMatrix();
	Renderer.setSize(window.innerWidth, window.innerHeight);
};

render();