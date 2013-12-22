/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 13:20:53
*/

module HG.Entities {

	export class FirstPersonCameraEntity extends HG.Entities.CameraEntity {

		object: THREE.PerspectiveCamera;
		target: THREE.Object3D;
		isOnObject: boolean;
		canJump: boolean;
		pitchObject: THREE.Object3D;
		yawObject: THREE.Object3D;
		PI_2: number = Math.PI / 2;

		constructor(fov: number = 90,
				aspect: number = 1.77, zNear: number = 0.1, zFar: number = 10000) {
			super();
			this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
			this.pitchObject = new THREE.Object3D();
			this.pitchObject.add(this.object);
			this.yawObject = new THREE.Object3D();
			this.yawObject.position.y = 10;
			this.yawObject.add(this.object);
			this.velocity = new THREE.Vector3();
		}

		onMouseMove(x: number, y: number): void {
			this.yawObject.rotation.y -= x * 0.002;
			this.pitchObject.rotation.x -= y * 0.002;

			this.pitchObject.rotation.x = Math.max(-this.PI_2,
				Math.min(this.PI_2, this.pitchObject.rotation.x));
		}

		setViewDistance(distance: number): void {
			this.object.far = distance;
			this.object.updateProjectionMatrix();
		}

		frame(delta: number): void {
			this.velocity.x += ( - this.velocity.x ) * 0.08 * delta;
			this.velocity.z += ( - this.velocity.z ) * 0.08 * delta;
			this.velocity.y -= 0.25 * delta;

			if ( this.isOnObject === true ) {
				this.velocity.y = Math.max( 0, this.velocity.y );
			}

			this.yawObject.translateX( this.velocity.x );
			this.yawObject.translateY( this.velocity.y );
			this.yawObject.translateZ( this.velocity.z );

			if ( this.yawObject.position.y < 10 ) {
				this.velocity.y = 0;
				this.yawObject.position.y = 10;

				this.canJump = true;
			}
		}

	}

}