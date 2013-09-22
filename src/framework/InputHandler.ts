module HG {

	export class InputHandler extends EventDispatcher {

		private KeyState: number[] = [];

		constructor() {
			super();
		}

		Bind: (code: number, ...args) => void = this.On;

		OnKeyDown(e: KeyboardEvent): void {
			this.KeyState[e.keyCode] = 1;
		}

		OnKeyUp(e: KeyboardEvent): void {
			this.KeyState[e.keyCode] = 0;
		}

		Frame(delta: number): void {
			for (var i = 0; i < this.KeyState.length; i++) {
				if (this.KeyState[i] === 1) {
					this.Dispatch(i, delta);
				}
			};
		}

	}

}