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
	_Object: [new THREE.Mesh(g, m), new THREE.PointLight(0xFFFFFF, 3, 500)]
});
player._Object.each(function(o) {
	Scene.add(o);
});
Camera.position.x = res.Start.x;


var render = function() {
	requestAnimationFrame(render);
	Renderer.render(Scene, Camera);
};

window.onkeypress = function(a) {
	if (a.keyCode === Settings.Keys.A) {
		player._Object.each(function(o) {
			o.position.x -= 7.5;
		});
		Camera.position.x -= 15;
	} else if (a.keyCode === Settings.Keys.D) {
		player._Object.each(function(o) {
			o.position.x += 7.5;
		});
		Camera.position.x += 15;
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