module HG.Entities {
	export class MovingEntity extends Entity {

		MoveLeft(step: number = 3.125): void {
			this.object.position.x -= step;
		}

		MoveRight(step: number = 3.125): void {
			this.object.position.x += step;
		}

	}
}