/*
* @Author: BeryJu
* @Date:   2013-12-30 21:05:51
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 22:37:45
*/

module HG.Input {

	export class KeyboardDevice extends HG.Core.EventDispatcher implements HG.Input.IDevice {

		private keyState: number[];

		constructor() {
			super();
			this.keyState = [];
			for (var k in HG.Utils.KEY_MAP) {
				this.events.push(HG.Utils.KEY_MAP[k].toString());
			}
		}

		onKeyDown(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 1;
		}

		onKeyUp(e: KeyboardEvent): void {
			this.keyState[e.keyCode] = 0;
		}

		frame(delta: number): void {
			this.keyState.forEach((s, i) => {
				if (s === 1) this.dispatch(i, delta);
			});
		}

	}

}