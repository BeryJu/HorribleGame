module HG {

	export module Entities {

		export class MovingEntity extends Entity {

			moveLeft(step: number = 3.125): void {
				this.object.position.x -= step;
			}

			moveRight(step: number = 3.125): void {
				this.object.position.x += step;
			}

			jumpState: number = 0;
			//0: normal
			//1: rising
			//2: max
			//3: falling
			oldY: number = 0;
			maxY: number = 200;

			jump(): void {
				this.oldY = this.object.position.y;
				this.jumpState = 1;
			}

			frame(delta: number): void {
				if (this.jumpState >= 1) {
					if (this.jumpState === 3) {
						this.oldY = this.object.position.y;
						this.jumpState = 0;
					}
					if (this.object.position.y < (this.maxY + this.oldY) && this.jumpState === 1) {
						this.object.position.y += 3 * delta;
					}
					if (this.object.position.y >= (this.maxY + this.oldY) && this.jumpState >= 1) {
						this.jumpState = 2;
					}
					if (this.object.position.y <= this.oldY && this.jumpState >= 2) {
						this.object.position.y = this.oldY;
						this.jumpState = 3;
					} else if (this.jumpState >= 2) {
						this.object.position.y -= 3 * delta;
					}
				}
			}
		}

	}

}