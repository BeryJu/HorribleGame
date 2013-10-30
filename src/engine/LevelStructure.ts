/// <reference path="utils/Noise.hg.ts" />
module HG {

	export var SIZE_X: number = 64;
	export var SIZE_Y: number = SIZE_X / 4;
	export var BLOCK_SIZE: number = 50;

	export class LevelStructure extends EventDispatcher{
		entities: Map<{}>;
		camera = {
			position: {x: 0, y: 0, z: 0},
			rotation: {x: 0, y: 0, z: 0}
		};
		eventsAvailable: string[] = ["loaded", "created"];

		constructor() {
			super();
		}

		load(JSONString: string): void {
			var r = JSON.parse(JSONString);
			this.entities = new HG.Map();
			for (var i = 0; i < SIZE_X * BLOCK_SIZE; i += BLOCK_SIZE) {
				for (var j = 0; j < SIZE_Y * BLOCK_SIZE; j += BLOCK_SIZE) {
					var e = r.entities['data'][i][j][0];
					this.entities.set(e, i, j);
				}
			}
			this.camera = r.camera;
			this.dispatch('loaded', {level: this});
		}

		loadAsync(path: string): void {
			global.fs.readFile(path, (err, data) => {
				this.load(data);
			});
		}
	
		create(): void {
			this.entities = new HG.Map();
			for (var i = 0; i < SIZE_X * BLOCK_SIZE; i += BLOCK_SIZE) {
				for (var j = 0; j < SIZE_Y * BLOCK_SIZE; j += BLOCK_SIZE) {
					var noise = HG.Utils.Noise.Generate2(i, j);
					var l = Math.floor((noise * 50) - 50);
					var color = HG.Utils.rgbToHex(i / 10 + 50, j / 10 + 50, ((i + j) / 2) / 10 + 50);
					var e = {
						type: "solid",
						indentation: l,
						color: color
					};
					this.entities.set(e, i, j);
				}
			}
			this.camera.position = {x: 0, y: 25, z: -25};
			this.camera.rotation = {x: 75, y: 75, z: 0};
			this.dispatch('created', {level: this});
		}
	}
}