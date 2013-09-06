var Renderer = new THREE.WebGLRenderer({antialias: Settings.Antialiasing});
Renderer.shadowMapEnabled = true;
Renderer.shadowMapSoft = true;
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.setClearColor(0x000000, 1);
document.body.appendChild(Renderer.domElement);

var Camera = new THREE.PerspectiveCamera(Settings.FOV,
	window.innerWidth / window.innerHeight, 0.1, Settings.ViewDistance);
Camera.position = new THREE.Vector3(0, 0, -20);
// Camera.rotation = new THREE.Vector3(263.5, 263.5, 0);


var Light = new THREE.PointLight(0xFFFFFF, 1, 100);
Light.position = new THREE.Vector3(0, 0, 0);
Light.castShadow = true;
Light.shadowDarkness = 0.5;
Light.shadowMapWidth = Settings.ShadowMapSize;
Light.shadowMapHeight = Settings.ShadowMapSize;

var scene = new THREE.Scene();

var res = Level.Load(Level.Create(Level.LevelPattern));
res.Entities.each(function(e) {
	e._Object.each(function(o) {
		scene.add(o);
	});
});
var g = new THREE.CubeGeometry(50, 50, 50);
var m = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = Entity.CreateEntity({
	Position: res.Start,
	_Object: [new THREE.Mesh(g, m)],
	Extra: {
		castShadow: true,
		receiveShadow: false
	}
});
scene.add(cube._Object[0]);



var controls = new THREE.TrackballControls( Camera );

controls.rotateSpeed = 2;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

controls.noZoom = false;
controls.noPan = false;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

controls.keys = [ 65, 83, 68 ];

controls.addEventListener( 'change', render );

function animate() {
	requestAnimationFrame(animate);
	controls.update();
}

function render() {
	Renderer.render(scene, Camera);
}

//window.onkeypress = function(a) {
//	Entities.each(function(e) {
//		e.OnKeyDown(a, e);
//	});
//};

window.onresize = function () {
	//Entities.each(function(e) {
	//	e.OnResize(e);
	//});
	Camera.aspect = window.innerWidth / window.innerHeight;
	Camera.updateProjectionMatrix();
	Renderer.setSize(window.innerWidth, window.innerHeight);
};
animate();