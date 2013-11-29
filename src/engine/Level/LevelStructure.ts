// /*
// * @Author: BeryJu
// * @Date:   2013-11-06 14:36:07
// * @Email:  jenslanghammer@gmail.com
// * @Last Modified by:   BeryJu
// * @Last Modified time: 2013-11-29 19:12:49
// */

// module HG.CONSTANTS {

// 	export var SIZE_X: number = 64;
// 	export var SIZE_Y: number = SIZE_X / 4;
// 	export var BLOCK_SIZE: number = 50;

// }

// module HG.Level {

// 	export class LevelEntity {

// 		position = {x: 0, y: 0, z: 0};
// 		color: number = 0x000000;

// 	}

// 	export class LevelStructure extends HG.Core.EventDispatcher implements HG.Resource.ILoadable {

// 		entities: HG.Level.LevelEntity[];
// 		camera = {
// 			position: {x: 0, y: 0, z: 0},
// 			rotation: {x: 0, y: 0, z: 0}
// 		};
// 		eventsAvailable: string[] = ["loaded", "created"];

// 		load(data: {}): void {
// 			var r = <HG.Level.LevelStructure> JSON.parse(data);
// 			this.entities = r.entities;
// 			this.camera = r.camera;
// 			this.dispatch('loaded', {level: this});
// 		}

// 		create(): void {
// 			this.entities = [];
// 			for (var i = 0; i < CONSTANTS.SIZE_X * CONSTANTS.BLOCK_SIZE; i += CONSTANTS.BLOCK_SIZE) {
// 				for (var j = 0; j < CONSTANTS.SIZE_Y * CONSTANTS.BLOCK_SIZE; j += CONSTANTS.BLOCK_SIZE) {
// 					var noise = HG.Utils.Noise.Generate2(i, j);
// 					var k = Math.floor((noise * 50) - 50);
// 					var color = HG.Utils.rgbToHex(i / 10 + 50, j / 10 + 50, ((i + j) / 2) / 10 + 50);
// 					var entity = new HG.Level.LevelEntity();
// 					entity.position = {x: i, y: j, z: k};
// 					entity.color = color
// 					this.entities.push(entity);
// 				}
// 			}
// 			this.camera.position = {x: 0, y: 25, z: -25};
// 			this.camera.rotation = {x: 75, y: 75, z: 0};
// 			this.dispatch('created', {level: this});
// 		}
// 	}
// }