/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:29
*/
/// <reference path="BaseEntity.ts" />

module HG {
	
	export module Entities {

		export class CameraEntity extends BaseEntity {

			object: THREE.PerspectiveCamera;

			constructor(fov: number = 90, aspect: number = 1.77, 
					zNear: number = 0.1, zFar: number = 10000) {
				super();
				this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
			}

			setViewDistance(distance: number): void {
				this.object.far = distance;
				this.object.updateProjectionMatrix();
			}

			resize(ratio: number): void {
				this.object.aspect = ratio;
				this.object.updateProjectionMatrix();
			}

		}

	}

}