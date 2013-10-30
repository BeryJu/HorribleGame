/// <reference path="BaseEntity.hg.ts" />
/*
* CameraEntity.hg.ts
* Author: BeryJu
*/

module HG {
	
	export module Entities {

		export class ChasingCameraEntity extends CameraEntity {

			object: THREE.PerspectiveCamera;
			target: HG.Entities.MeshEntity;
			lookAt: boolean = true;

			constructor(target: HG.Entities.MeshEntity, fov: number = 90, 
					aspect: number = 1.77, zNear: number = 0.1, zFar: number = 10000) {
				super();
				this.target = target;
				this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
			}

			setViewDistance(d: number): void {
				this.object.far = d;
				this.object.updateProjectionMatrix();
			}

			frame(delta: number): void {
				var cameraOffset = this.positionOffset.clone().applyMatrix4(
					this.target.object.matrixWorld );

				this.object.position.x = cameraOffset.x;
				this.object.position.y = cameraOffset.y;
				this.object.position.z = cameraOffset.z;
				if (this.lookAt) this.object.lookAt(this.target.object.position);
			}

		}

	}

}