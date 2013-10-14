/// <reference path="utils/Noise.hg.ts" />
module HG {

	export var SIZE_X: number = 64;
	export var SIZE_Y: number = HG.SIZE_X / 4;
	export var BLOCK_SIZE: number = 50;

	export class LevelStructure extends EventDispatcher{
		entities: HG.Map = new HG.Map();
		camera = {
			position: {x: 0, y: 0, z: 0},
			rotation: {x: 0, y: 0, z: 0}
		};

		constructor() {
			super();
		}

		load(JSONString: string): void {
			var r = JSON.parse(JSONString);
			this.entities = new HG.Map();
			for (var i = 0; i < HG.SIZE_X * HG.BLOCK_SIZE; i += HG.BLOCK_SIZE) {
				for (var j = 0; j < HG.SIZE_Y * HG.BLOCK_SIZE; j += HG.BLOCK_SIZE) {
					var e = r.entities['data'][i][j][0];
					this.entities.set(e, i, j);
				}
			}
			this.camera = r.camera;
			this.dispatch('loaded', {level: this});
		}

		onReadyStateChange(req): void {
			if (req.readyState === 4) {
				this.load(req.responseText);
			}
		}

		loadAsync(url: string): void {
			var req = new XMLHttpRequest();
			var t = this;
			req.onreadystatechange = function(req) {
				t.onReadyStateChange(this);
			};
			req.open("GET", url, true);
			req.send();
		}
	
		create(Seed?: number): void {
			this.entities = new HG.Map();
			for (var i = 0; i < HG.SIZE_X * HG.BLOCK_SIZE; i += HG.BLOCK_SIZE) {
				for (var j = 0; j < HG.SIZE_Y * HG.BLOCK_SIZE; j += HG.BLOCK_SIZE) {
					var noise = HG.Noise.Generate2(i, j);
					var l = Math.floor((noise * 50) - 50);
					var color = Utils.rgbToHex(i / 10 + 50, j / 10 + 50, ((i + j) / 2) / 10 + 50);
					var e = {
						type: "solid",
						indentation: l,
						color: color
					};
					this.entities.set(e, i, j);
				}
			}
			this.camera.position = {x: -127, y: 290, z: 250};
			this.camera.rotation = {x: 75, y: 75, z: 0};
			this.dispatch('created', {level: this});
		}
	}
}