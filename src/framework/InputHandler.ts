module HG {

	export class InputHandler extends EventDispatcher {

		private keyState: number[] = [];

		constructor() {
			super();
		}

		bind: (code: number, ...args) => void = this.on;

		onKeyDown(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 1;
		}

		onKeyUp(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 0;
		}

		frame(delta: number): void {
			for (var i = 0; i < this.keyState.length; i++) {
				if (this.keyState[i] === 1) {
					this.dispatch(i, delta);
				}
			};
		}

	}

}