/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 16:30:19
*/

module HG.Entities {

	export class FirstPersonCameraEntity extends HG.Entities.CameraEntity {

		object: THREE.PerspectiveCamera;
		target: HG.Entities.MeshEntity;
		lookAt: boolean = true;

		constructor(fov: number = 90,
				aspect: number = 1.77, zNear: number = 0.1, zFar: number = 10000) {
			super();
			this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
		}

		setViewDistance(d: number): void {
			this.object.far = d;
			this.object.updateProjectionMatrix();
		}

		frame(delta: number): void {
			var cameraOffset = this.positionOffset.clone().applyMatrix4(
				this.target.object.matrixWorld );
			HG.log(typeof cameraOffset);
			this.object.position.x = cameraOffset.x;
			this.object.position.y = cameraOffset.y;
			this.object.position.z = cameraOffset.z;
			if (this.lookAt) this.object.lookAt(this.target.object.position);
		}

	}

}