var Entity = {
	CreateEntity: function(params) {
		params = params || Entity.DefaultEntityParams;
		params.__proto__ = Entity.DefaultEntityParams;
		var finalObjects = [];
		params._Object.each(function(o) {
			if (params.Extra !== {}) {
				for (var key in params.Extra) {
					o[key] = params.Extra[key];
				}
			}
			if (o.material)
				o.wireframe = Settings.Debug;
			if (o.target)
				o.target.position = params.TargetPosition;
			o.position = params.Position;
			o.rotation = params.Rotation;
			finalObjects.push(o);
		});
		return {
			__proto__: Entity.IEntity,
			_Object: finalObjects,
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
					// var m = new THREE.MeshBasicMaterial({
					// 	color: parseInt(Utils.RGBToHex(e.Color), 16)
					// });
					var m = new THREE.MeshPhongMaterial({
						ambient: 0x555555,
						color: 0x555555,
						specular: 0xffffff,
						shininess: 50,
						shading: THREE.SmoothShading
					});
					Entities.push(Entity.CreateEntity({
						Position: new THREE.Vector3(e.Position[0], e.Position[1], 0),
						_Object: [new THREE.Mesh(g, m)]
					}));
				}
			});
		});
		return {
			RawData: raw,
			Start: new THREE.Vector3(raw.Start[0] * Level.Step,
				raw.Start[1] * Level.Step, 0),
			Light: new THREE.Vector3(raw.Light[0] * Level.Step,
				raw.Light[1] * Level.Step, 0),
			Entities: Entities
		};
	},
	Create: function(Pattern) {
		var width = 96;
		var height = 8;
		var levelData = [];
		Level.PatternReplace(Pattern[5].pattern, 0).each(function(c) {
			levelData.push(c);
		});
		for (var x = 4; x <= width - 4; x += 4) {
			var rnd = Math.floor(Math.random() * (Pattern.length - 2));
			var nextPat = Pattern[rnd].pattern;
			var finPat = Level.PatternReplace(nextPat, x);
			finPat.each(function(col) {
				levelData.push(col);
			});
		}
		Level.PatternReplace(Pattern[4].pattern, x).each(function(c) {
			levelData.push(c);
		});
		return {
			Level: levelData.reverse(),
			Start: [97, 2],
			Light: [97, 2]
		};
	},
	PatternReplace: function(pat, x) {
		var fin = [];
		x = Math.abs(x);
		var y = 0;
		pat.each(function(col) {
			var finCol = [];
			y = 0;
			col.each(function(b) {
				var block;
				if (b !== 0) {
					block = {
						Position:[x * Level.Step,y * Level.Step],
						// Color: [y * 31]
						Color: [0, 0, 255]
					};
				} else {
					block = 0;
				}
				finCol.push(block);
				y++;
			});
			fin.push(finCol);
			x++;
		});
		return fin;
	},
	LevelPattern: [
		{
			pattern: [
				[1, 1, 0, 0, 0, 0, 1, 1],
				[0, 0, 0, 0, 0, 0, 1, 1],
				[0, 0, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1]
			]
		},
		{
			pattern: [
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 1, 1, 0, 0, 0, 1]
			]
		},
		{
			pattern: [
				[1, 1, 1, 1, 0, 0, 0, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1]
			]
		},
		{
			pattern: [
				[1, 1, 1, 1, 0, 0, 0, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 1, 1, 0, 0, 0, 1]
			]
		},
		{
			pattern: [
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1]
			]
		},
		{
			pattern: [
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1]
			]
		}
	],
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