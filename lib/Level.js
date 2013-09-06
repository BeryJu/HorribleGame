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
