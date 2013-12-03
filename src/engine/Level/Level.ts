// /*
// * @Author: BeryJu
// * @Date:   2013-11-06 14:36:08
// * @Email:  jenslanghammer@gmail.com
// * @Last Modified by:   BeryJu
// * @Last Modified time: 2013-11-29 19:11:17
// */

// module HG.Level {

// 	export class Level extends HG.Core.EventDispatcher {

// 		entities: HG.Entities.new Array<BaseEntity>() = [];
// 		camera = {
// 			position: new THREE.Vector3(),
// 			rotation: new THREE.Vector3()
// 		};

// 		constructor(level: HG.Level.LevelStructure) {
// 			super();
// 			// Todo redo this
// 			// var g = new THREE.CubeGeometry(
// 			// 	HG.CONSTANTS.BLOCK_SIZE,
// 			// 	HG.CONSTANTS.BLOCK_SIZE,
// 			// 	HG.CONSTANTS.BLOCK_SIZE
// 			// );
// 			// var m =  new THREE.MeshPhongMaterial({color: 0x000000});
// 			// level.entities.forEach((e) => {
// 			// 	m.color = new THREE.Color(e.color);
// 			// 	var en = new HG.Entities.MeshEntity(g, m);
// 			// 	en.position(e.position.x, e.position.y, e.position.z);
// 			// });
// 			this.camera.position =
// 				new THREE.Vector3(level.camera.position.x, level.camera.position.y,
// 					level.camera.position.z);
// 			this.camera.rotation =
// 				new THREE.Vector3(level.camera.rotation.x, level.camera.rotation.y,
// 					level.camera.rotation.z);
// 		}

// 		applyCamera(camera: Entities.CameraEntity): void {
// 			camera.object.position = this.camera.position;
// 			camera.rotate(this.camera.rotation.x,
// 						this.camera.rotation.y,
// 						this.camera.rotation.z);
// 		}

// 		applyCameraOffset(camera: Entities.CameraEntity): void {
// 			camera.offset(this.camera.position.x,
// 						this.camera.position.y,
// 						this.camera.position.z);
// 			camera.rotate(this.camera.rotation.x,
// 						this.camera.rotation.y,
// 						this.camera.rotation.z);
// 		}

// 	}

// }