/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 23:03:42
*/

module HG.Entities {

	export class FirstPersonCameraEntity extends HG.Entities.CameraEntity {

		object: THREE.PerspectiveCamera;
		target: THREE.Object3D;
		isOnObject: boolean;
		canJump: boolean;
		PI_2: number = Math.PI / 2;

		constructor(fov: number = 90,
				aspect: number = 1.77, zNear: number = 0.1, zFar: number = 10000) {
			super();
			this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
			this.velocity = new THREE.Vector3();
		}

		onMouseMove(x: number, y: number): void {
			this.object.rotation.x -= x * 0.000002;
			this.object.rotation.y -= y * 0.000002;

			// this.object.rotation.x = Math.max(-(this.PI_2),
			// 	Math.min((this.PI_2), this.object.rotation.x));
		}

		setViewDistance(distance: number): void {
			this.object.far = distance;
			this.object.updateProjectionMatrix();
		}

		frame(delta: number): void {
			// this.velocity.x += ( - this.velocity.x ) * 0.08 * delta;
			// this.velocity.z += ( - this.velocity.z ) * 0.08 * delta;
			// this.velocity.y -= 0.25 * delta;

			// if ( this.isOnObject === true ) {
			// 	this.velocity.y = Math.max( 0, this.velocity.y );
			// }

			this.object.translateX( this.velocity.x );
			this.object.translateY( this.velocity.y );
			this.object.translateZ( this.velocity.z );

			// if ( this.object.position.y < 10 ) {
			// 	this.velocity.y = 0;
			// 	this.object.position.y = 10;

			// 	this.canJump = true;
			// }
		}

	}

}