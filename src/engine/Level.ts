/// <reference path="LevelStructure.ts" />

module HG {
	
	export class Level extends EventDispatcher {

		entities: HG.BaseEntity[] = [];
		camera = {
			position: new THREE.Vector3(),
			rotation: new THREE.Vector3()
		};

		constructor(lvl: HG.LevelStructure) {
			super();
			for (var i = 0; i < HG.SIZE_X * HG.BLOCK_SIZE; i += HG.BLOCK_SIZE) {
				for (var j = 0; j < HG.SIZE_Y * HG.BLOCK_SIZE; j += HG.BLOCK_SIZE) {
					var be = lvl.entities.get(i, j);
					var re = new HG.BaseEntity(
						new THREE.Mesh(
							new THREE.CubeGeometry(HG.BLOCK_SIZE,HG.BLOCK_SIZE, HG.BLOCK_SIZE),
							new THREE.MeshPhongMaterial({color: be.color})
						)
					);
					re.position(i, j, be.indentation);
					this.entities.push(re);
				}
			}
			this.camera.position =
				new THREE.Vector3(lvl.camera.position.x, lvl.camera.position.y, lvl.camera.position.z);
			this.camera.rotation =
				new THREE.Vector3(lvl.camera.rotation.x, lvl.camera.rotation.y, lvl.camera.rotation.z);
		}

		applyCamera(camera: THREE.Camera): void {
			camera.position = this.camera.position;
			camera.rotation.x = this.camera.rotation.x;
			camera.rotation.y = this.camera.rotation.y;
			camera.rotation.z = this.camera.rotation.z;
		}

	}

}