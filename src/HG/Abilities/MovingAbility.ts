/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 18:24:05
*/

module HG.Abilities {

	export class MovingAbility extends HG.Abilities.Ability {

		baseStep: number;

		constructor(baseStep: number) {
			super();
			this.baseStep = baseStep;
		}

		moveLeft(delta: number): void {
			this.host.object.translateX(delta * this.baseStep);
		}

		moveRight(delta: number): void {
			this.host.object.translateX(-delta * this.baseStep);
		}

		lower(delta: number): void {
			this.host.object.position.y -= (delta * this.baseStep);
		}

		jump(delta: number): void {
			this.host.object.position.y += (delta * this.baseStep);
		}

		turnLeft(delta: number): void {
			this.host.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), (delta * this.baseStep).toRadian());
		}

		turnRight(delta: number): void {
			this.host.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-delta * this.baseStep).toRadian());
		}

		moveForward(delta: number): void {
			this.host.object.translateZ(delta * this.baseStep);
		}

		moveBackward(delta: number): void {
			this.host.object.translateZ(-delta * this.baseStep);
		}

	}

}