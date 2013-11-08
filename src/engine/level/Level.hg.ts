/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-08 18:17:12
*/
/// <reference path="LevelStructure.hg.ts" />

module HG {
	
	export class Level extends EventDispatcher {

		entities: BaseEntity[] = [];
		camera = {
			position: new THREE.Vector3(),
			rotation: new THREE.Vector3()
		};

		constructor(lvl: LevelStructure) {
			super();
			var g = new THREE.CubeGeometry(
				HG.CONSTANTS.BLOCK_SIZE,
				HG.CONSTANTS.BLOCK_SIZE,
				HG.CONSTANTS.BLOCK_SIZE
			);
			var m =  new THREE.MeshPhongMaterial({color: 0x000000});
			lvl.entities.forEach((e) => {
				m.color = new THREE.Color(e.color);
				var en = new HG.Entities.MeshEntity(g, m);
				en.position(e.position.x, e.position.y, e.position.z);
			});
			this.camera.position =
				new THREE.Vector3(lvl.camera.position.x, lvl.camera.position.y, 
					lvl.camera.position.z);
			this.camera.rotation =
				new THREE.Vector3(lvl.camera.rotation.x, lvl.camera.rotation.y, 
					lvl.camera.rotation.z);
		}

		applyCamera(camera: Entities.CameraEntity): void {
			camera.object.position = this.camera.position;
			camera.rotate(this.camera.rotation.x,
						this.camera.rotation.y,
						this.camera.rotation.z);
		}

		applyCameraOffset(camera: Entities.CameraEntity): void {
			camera.offset(this.camera.position.x,
						this.camera.position.y,
						this.camera.position.z);
			camera.rotate(this.camera.rotation.x,
						this.camera.rotation.y,
						this.camera.rotation.z);
		}

	}

}