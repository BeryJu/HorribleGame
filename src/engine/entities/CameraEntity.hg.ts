/// <reference path="BaseEntity.hg.ts" />
/*
* CameraEntity.hg.ts
* Author: BeryJu
*/

module HG {
	
	export module Entities {

		export class CameraEntity extends BaseEntity {

			object: THREE.PerspectiveCamera;

			constructor(fov: number = 90, aspect: number = 1.77, zNear: number = 0.1, zFar: number = 10000) {
				super();
				this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
			}

			setViewDistance(d: number): void {
				this.object.far = d;
				this.object.updateProjectionMatrix();
			}

		}

	}

}
