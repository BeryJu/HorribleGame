module HG {

	export module Entities {

		export class MovingEntity extends Entity {

			MoveLeft(step: number = 3.125): void {
				this.object.position.x -= step;
			}

			MoveRight(step: number = 3.125): void {
				this.object.position.x += step;
			}

			JumpState: number = 0;
			//0: normal
			//1: rising
			//2: max
			//3: falling

			Jump(maxY: number = 100): void {
				this.object.position.y += maxY;
			}
		}

	}

}