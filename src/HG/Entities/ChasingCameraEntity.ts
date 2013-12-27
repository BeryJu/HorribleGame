/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-27 20:14:34
*/

module HG.Entities {

	export class ChasingCameraEntity extends HG.Entities.CameraEntity {

		object: THREE.PerspectiveCamera;
		_target: HG.Entities.MeshEntity;

		set target (t: HG.Entities.MeshEntity) {
			this._target = t;
			this._target.object.add(this.object);
		}

		constructor(target: HG.Entities.MeshEntity, fov: number = 90,
				aspect: number = 1.77, zNear: number = 0.1, zFar: number = 10000) {
			super();
			if (target === null) {
				HG.locale.errors.nullReferenceError.error();
			}
			this.target = target;
			this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
		}

		frame(delta: number): void {
			this._target.object.updateMatrixWorld(true);
			var cameraOffset = this.positionOffset.clone().
					applyMatrix4(this._target.object.matrixWorld);
			this.object.position = cameraOffset;
			this.object.lookAt(this._target.object.position);
		}

	}

}