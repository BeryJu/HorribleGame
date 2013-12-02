/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 16:30:18
*/

module HG.Abilities {

	export class MovingAbility extends HG.Abilities.BaseAbility {

		jumpState: number = 0;
		//0: normal
		//1: rising
		//2: max
		//3: falling
		oldY: number = 0;
		maxY: number = 200;

		moveLeft(step: number): void {
			this.hostEntity.object.translateX(step);
		}

		moveRight(step: number): void {
			this.hostEntity.object.translateX(-step);
		}

		lower(step: number): void {
			this.hostEntity.object.position.y -= step;
		}

		turnLeft(step: number): void {
			this.hostEntity.object.rotateOnAxis(new THREE.Vector3(0, 1, 0),
				step.toRadian());
		}

		turnRight(step: number): void {
			this.hostEntity.object.rotateOnAxis(new THREE.Vector3(0, 1, 0),
				-step.toRadian());
		}

		moveForward(step: number): void {
			this.hostEntity.object.translateZ(step);
		}

		moveBackward(step: number): void {
			this.hostEntity.object.translateZ(-step);
		}

		jump(): void {
			this.oldY = this.hostEntity.object.position.y;
			this.jumpState = 1;
		}

		frame(delta: number): void {
			if (this.jumpState >= 1) {
				if (this.jumpState === 3) {
					this.oldY = this.hostEntity.object.position.y;
					this.jumpState = 0;
				}
				if (this.hostEntity.object.position.y < (this.maxY + this.oldY) && this.jumpState === 1) {
					this.hostEntity.object.position.y += 3 * delta;
				}
				if (this.hostEntity.object.position.y >= (this.maxY + this.oldY) && this.jumpState >= 1) {
					this.jumpState = 2;
				}
				if (this.hostEntity.object.position.y <= this.oldY && this.jumpState >= 2) {
					this.hostEntity.object.position.y = this.oldY;
					this.jumpState = 3;
				} else if (this.jumpState >= 2) {
						this.hostEntity.object.position.y -= 3 * delta;
				}
			}
		}
	}

}