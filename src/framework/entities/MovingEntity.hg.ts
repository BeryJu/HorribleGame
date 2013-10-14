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

			jump(maxY: number = 100): void {
				this.object.position.y += maxY;
			}
		}

	}

}