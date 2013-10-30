module HG {

	export class InputHandler extends GameComponent {

		private keyState: number[] = [];
		private mouseX: number = 0;
		private mouseY: number = 0;
		bind = this.on;

		get mousePosition(): THREE.Vector2 {
			return new THREE.Vector2(this.mouseX, this.mouseY);
		}

		constructor() {
			super();
			for (var k in KeyMap) {
				this.eventsAvailable.push(KeyMap[k]);
			}
		}

		onKeyDown(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 1;
		}

		onKeyUp(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 0;
		}

		frame(delta: number): void {
			for (var i = 0; i < this.keyState.length; i++) {
				if (this.keyState[i] === 1) {
					this.dispatch(i, {delta: delta});
				}
			}
		}

	}

}