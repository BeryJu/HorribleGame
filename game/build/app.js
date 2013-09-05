var Entity = {
	CreateEntity: function(params) {
		params = params || Entity.DefaultEntityParams;
		params.__proto__ = Entity.DefaultEntityParams;
		var _Object = params._Object;
		if (params.Extra !== {}) {
			for (var key in params.Extra) {
				_Object[key] = params.Extra[key];
			}
		}
		if (_Object.material)
			_Object.wireframe = Settings.Debug;
		_Object.position = params.Position;
		_Object.rotation = params.Rotation;
		if (_Object.target)
			_Object.target.position = params.TargetPosition;
		return {
			__proto__: Entity.IEntity,
			_Object: _Object,
			OnLoad: params.OnLoad,
			OnKeyDown: params.OnKeyDown,
			OnResize: params.OnResize,
			OnRender: params.OnRender
		};
	},
	IEntity: {
		_Object: undefined, //THREE.js Mesh
		OnLoad: function(self) {},
		OnKeyDown: function(e, self) {},
		OnResize: function(self) {},
		OnRender: function(self) {}
	},
	DefaultEntityParams: {
		Extra: {
			castShadow: true,
			receiveShadow: true
		},
		Position: new THREE.Vector3(0, 0, 0),
		Rotation: new THREE.Vector3(0, 0, 0),
		TargetPosition: new THREE.Vector3(0, 0, 0),
		_Object: new THREE.Mesh(
			new THREE.CubeGeometry(0, 0, 0),
			new THREE.MeshBasicMaterial({color: 0xffffff})),
		OnLoad: function(self) {},
		OnKeyDown: function(e, self) {},
		OnResize: function(self) {},
		OnRender: function(self) {}
	}
};

var EntityManager = function(Entities) {
	this.Entities = Entities || [];
	this.Scene = new THREE.Scene();
	this.forEach = function(callback) {
		this.Entities.forEach(function(e) {
			callback(e);
		});
	};
	this.each = this.forEach;
	this.push = function(e) {
		if (e.__proto__ === Entity.IEntity) {
			this.Entities.push(e);
			this.Scene.add(e._Object);
		} else {
			this.Entities.push(Entity.CreateEntity({
				_Object: e
			}));
			this.Scene.add(e);
		}
	};
	this.GetScene = function() {
		return this.Scene;
	};
};
var Level = {
	Step: 50,
	Load: function(raw) {
		var Entities = [];
		raw.Level.each(function(col) {
			col.each(function(e) {
				if (e !== 0) {
					var g = new THREE.CubeGeometry(Level.Step, Level.Step, Level.Step);
					var m = new THREE.MeshBasicMaterial({color: 0x232323});
					Entities.push(Entity.CreateEntity({
						Position: new THREE.Vector3(e.Position[0], e.Position[1], 0),
						_Object: new THREE.Mesh(g, m),
						Extra: {
							castShadow: true,
							receiveShadow: false
						}
					}));
				}
			});
		});
		return {
			RawData: raw,
			Entities: Entities
		};
	},
	Create: function() {
		var width = 96;
		var height = 8;
		var levelData = [];
		for (var y = 0; y < width; y++) {
			var col = [];
			for (var x = 0; x < height; x++) {
				var type = Math.floor(Math.random() * 2);
				var block;
				if (type === 0) {
					block = {
						Position:[y * Level.Step,x * Level.Step],
						Color: [0,255,0]
					};
				} else {
					block = 0;
				}
				col.push(block);
			}
			levelData.push(col);
		}
		return {
			Level: levelData,
			Start: [95, 7]
		};
	},
	LoadAsync: function(url, res) {
		var Request = new XMLHttpRequest();
		Request.onreadystatechange = function(Request) {
			if (this.readyState === 4 && this.status === 200) {
				console.log("Loaded Level from "+url);
				if (res instanceof EntityManager) {
					JSON.parse(this.responseText).Level.each(function(e) {
						res.push(e);
					});
				} else {
					res(Level.Load(JSON.parse(this.responseText)));
				}
			}
		};
		Request.open("GET", url, true);
		Request.send();
	}
};

var Settings = {
	FOV: 110,
	ViewDistance: 4800,
	Debug: true,
	ShadowMapSize: 2048,
	ColorKey: "3c",
	Antialiasing: true,
	LevelURL: "http://lina/dev/projects/HorribleGame/assets/levels/level.json",
	Keys: {
		D: 100,
		A: 97,
		S: 115,
		W: 119,
		Space: 32
	}
};
Array.prototype.each = Array.prototype.forEach;
var Utils = {
	RGBToHex: function(input, prefix) {
		if (!input) return false;
		if (!(input instanceof Array)) input = [input];
		if (input.length < 3) {
			for (var i = 0; i < 2; i++) {
				input.push(input[0]);
			}
		}
		var Hex = prefix || "0x";
		input.each(function(c) {
			var h = parseInt(c, 0).toString(16);
			if (h.length < 2)
				Hex += "0"+h;
			else
				Hex += h;
		});
		return Hex;
	}
};
var Renderer = new THREE.WebGLRenderer({antialias: Settings.Antialiasing});
Renderer.shadowMapEnabled = true;
Renderer.shadowMapSoft = true;
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.setClearColor(0x000000, 1);
document.body.appendChild(Renderer.domElement);

var Camera = new THREE.PerspectiveCamera(Settings.FOV,
	window.innerWidth / window.innerHeight, 0.1, Settings.ViewDistance);
Camera.position = new THREE.Vector3(0, 0, -20);
Camera.rotation = new THREE.Vector3(263.5, 263.5, 0);


var Light = new THREE.PointLight(0xFFFFFF, 1, 100);
Light.position = new THREE.Vector3(0, 0, 0);
Light.castShadow = true;
Light.shadowDarkness = 0.5;
Light.shadowMapWidth = Settings.ShadowMapSize;
Light.shadowMapHeight = Settings.ShadowMapSize;

var scene = new THREE.Scene();

Level.LoadAsync(Settings.LevelURL, function(res) {
	res.Entities.each(function(e) {
		scene.add(e._Object);
	});
});

var geometry = new THREE.CubeGeometry(50, 50, 50);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);


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