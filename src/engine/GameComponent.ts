module HG {
	export class GameComponent extends EventDispatcher{
		constructor() {
			super();
		}

		frame(delta: number): any {}
	}
}