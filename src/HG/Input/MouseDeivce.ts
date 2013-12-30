/*
* @Author: BeryJu
* @Date:   2013-12-30 21:06:54
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 22:46:06
*/

module HG.Input {

	export class MouseDevice extends HG.Core.EventDispatcher implements HG.Input.IDevice {

		private mouseState: number[];
		private cursorPosition: THREE.Vector2;

		constructor() {
			super();
			this.cursorPosition = new THREE.Vector2();
			this.mouseState = [];
		}

		onMouseMove(e: MouseEvent): void {
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			var movX = e.webkitMovementX;
			var movY = e.webkitMovementY;
			if (x !== this.cursorPosition.x) {
				this.cursorPosition.x = x;
				this.dispatch("x", movX, x);
			}
			if (y !== this.cursorPosition.y) {
				this.cursorPosition.y = y;
				this.dispatch("y", movY, y);
			}
			this.dispatch("mouseAbs", x, y);
			this.dispatch("mouseRel", movX, movY);
		}

		onMouseDown(e: MouseEvent): void {
			this.mouseState[e.button] = 1;
		}

		onMouseUp(e: MouseEvent): void {
			this.mouseState[e.button] = 0;
		}

		frame(delta: number): void {
			this.mouseState.forEach((s, i) => {
				if (s === 1) this.dispatch(i, delta);
			});
		}

	}

}