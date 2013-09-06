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
					var m = new THREE.MeshBasicMaterial({
						color: parseInt(Utils.RGBToHex(e.Color), 16)
					});
					Entities.push(Entity.CreateEntity({
						Position: new THREE.Vector3(e.Position[0], e.Position[1], 0),
						_Object: [new THREE.Mesh(g, m)],
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
			Start: new THREE.Vector3(raw.Start[0] * Level.Step,
				raw.Start[1] * Level.Step, 0),
			Entities: Entities
		};
	},
	Create: function(Pattern) {
		var width = 96;
		var height = 8;
		var levelData = [];
		for (var x = 0; x <= width; x += 4) {
			var rnd = Math.floor(Math.random() * Pattern.length);
			var nextPat = Pattern[rnd].pattern;
			var finPat = Level.PatternReplace(nextPat, x);
			console.log(x);
			finPat.each(function(col) {
				levelData.push(col);
			});
		}
		return {
			Level: levelData,
			Start: [0, 2]
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
						Color: [3, 255, 3]
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
		console.log(x);
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