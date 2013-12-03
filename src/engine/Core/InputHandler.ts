/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 20:33:16
*/

module HG.Core {

	export class InputHandler {

		mouse: HG.Core.EventDispatcher;
		keyboard: HG.Core.EventDispatcher;
		private keyState: number[] = [];
		private mouseState: number[] = [];
		private _mouse: THREE.Vector2;

		get mousePosition(): THREE.Vector2 {
			return this._mouse;
		}

		constructor() {
			this.mouse = new HG.Core.EventDispatcher(["x", "y", "move"]);
			this.keyboard = new HG.Core.EventDispatcher();
			this._mouse = new THREE.Vector2();
			for (var k in HG.Utils.KEY_MAP) {
				this.keyboard.events.push(HG.Utils.KEY_MAP[k.toString()]);
			}
		}

		onMouseMove(e: MouseEvent): void {
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			if (x !== this._mouse.x) {
				var diffX = this._mouse.x - x;
				this._mouse.x = x;
				this.mouse.dispatch("x", diffX, x);
			}
			if (y !== this._mouse.y) {
				var diffY = this._mouse.y - y;
				this._mouse.y = y;
				this.mouse.dispatch("y", diffY, y);
			}
			this.mouse.dispatch("move", x, y);
		}

		onMouseDown(e: MouseEvent): void {
			this.mouseState[e.button] = 1;
		}

		onMouseUp(e: MouseEvent): void {
			this.mouseState[e.button] = 0;
		}

		onKeyDown(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 1;
		}

		onKeyUp(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 0;
		}

		frame(delta: number): void {
			this.keyState.forEach((s, i) => {
				if (s === 1) this.keyboard.dispatch(i, delta);
			});
			this.mouseState.forEach((s, i) => {
				if (s === 1) this.mouse.dispatch(i, delta);
			});
		}

	}

}