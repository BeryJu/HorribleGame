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
			Start: [height - 1, width - 1]
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
