/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-25 01:21:35
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
			this.mouse = new HG.Core.EventDispatcher(["x", "y", "mouseAbs", "mouseRel"]);
			this._mouse = new THREE.Vector2();

			this.keyboard = new HG.Core.EventDispatcher();
			for (var k in HG.Utils.KEY_MAP) {
				this.keyboard.events.push(HG.Utils.KEY_MAP[k].toString());
			}
		}

		onMouseMove(e: MouseEvent): void {
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			var movX = e.webkitMovementX;
			var movY = e.webkitMovementY;
			if (x !== this._mouse.x) {
				this._mouse.x = x;
				this.mouse.dispatch("x", movX, x);
			}
			if (y !== this._mouse.y) {
				this._mouse.y = y;
				this.mouse.dispatch("y", movY, y);
			}
			this.mouse.dispatch("mouseAbs", x, y);
			this.mouse.dispatch("mouseRel", movX, movY);
		}

		concat(otherHandler: HG.Core.InputHandler): HG.Core.InputHandler {
			var newHandler = new HG.Core.InputHandler();
			newHandler.keyboard = this.keyboard.concat(otherHandler.keyboard);
			newHandler.mouse = this.mouse.concat(otherHandler.mouse);
			return newHandler;
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