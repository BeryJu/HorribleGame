/*
* @Author: BeryJu
* @Date:   2013-12-30 20:33:11
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 22:43:59
*/

module HG.Input {

	export class GamepadDevice extends HG.Core.EventDispatcher implements HG.Input.IDevice {

		last: Gamepad;
		raw: Gamepad;
		id: number;

		constructor(id: number) {
			super();
			this.id = id;
		}

		frame(delta: number): void {
			if (this.raw === undefined) return;
			if (this.last === null) this.last = this.raw;
			//check stuff
			this.last = this.raw;
		}

	}

}