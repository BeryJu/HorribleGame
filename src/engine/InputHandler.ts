/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-07 16:19:55
*/
module HG {

	export class InputHandler extends EventDispatcher {

		private keyState: number[] = [];
		private mouseState: number[] = [];
		private lastMouse: THREE.Vector2;
		eventsAvailable: string[] = ['mouseX', 'mouseY'];
		bind = this.on;

		get mousePosition(): THREE.Vector2 {
			return this.lastMouse;
		}

		constructor() {
			super();
			for (var k in KeyMap) {
				this.eventsAvailable.push(KeyMap[k]);
			}
		}

		onMouseMove(e: MouseEvent): void {
			var x = e.x || e.clientX;
			var y = e.y || e.clientY;
			if (x !== this.lastMouse.x) {
				var diffX = this.lastMouse.x - x;
				this.lastMouse.x = x;
				this.dispatch('mouseX', diffX, x);
			}
			if (y !== this.lastMouse.y) {
				var diffY = this.lastMouse.y - y;
				this.lastMouse.y = y;
				this.dispatch('mouseX', diffY, y)
			}
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
				if (s === 1) this.dispatch("keyboard"+i, delta);
			});
			this.mouseState.forEach((s, i) => {
				if (s === 1) this.dispatch("mouse"+i, delta);
			});
		}

	}

}