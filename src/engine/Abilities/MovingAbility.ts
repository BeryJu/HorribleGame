/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 11:32:48
*/

module HG.Abilities {

	export class MovingAbility extends HG.Abilities.BaseAbility {

		moveLeft(step: number): void {
			this.hosts.forEach((host) => {
				host.object.translateX(step);
			});
		}

		moveRight(step: number): void {
			this.hosts.forEach((host) => {
				host.object.translateX(-step);
			});
		}

		lower(step: number): void {
			this.hosts.forEach((host) => {
				host.object.position.y -= step;
			});
		}

		turnLeft(step: number): void {
			this.hosts.forEach((host) => {
				host.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), step.toRadian());
			});
		}

		turnRight(step: number): void {
			this.hosts.forEach((host) => {
				host.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -step.toRadian());
			});
		}

		moveForward(step: number): void {
			this.hosts.forEach((host) => {
				host.object.translateZ(step);
			});
		}

		moveBackward(step: number): void {
			this.hosts.forEach((host) => {
				host.object.translateZ(-step);
			});
		}

		frame(delta: number): void {
			return;
		}
	}

}