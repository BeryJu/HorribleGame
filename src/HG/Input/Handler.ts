/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-31 13:08:55
*/

module HG.Input {

	export enum DEVICE {

		KEYBOARD = 0,
		MOUSE = 1,
		GAMEPAD = 3

	}

	export class Binding {

		device: HG.Input.DEVICE;
		keyCode: number;
		handler: Function;

	}

	export class Handler {

		mouse: HG.Input.MouseDevice;
		keyboard: HG.Input.KeyboardDevice;
		gamepad: HG.Input.GamepadDevice[];

		constructor() {
			this.mouse = new HG.Input.MouseDevice();
			this.keyboard = new HG.Input.KeyboardDevice();
			for (var id = 0; id < 4; id ++) {
				this.gamepad.push(new HG.Input.GamepadDevice(id));
			}
		}

		frame(delta: number): void {
			this.keyboard.frame(delta);
			this.mouse.frame(delta);
			this.gamepad = [];
			var gamepads = navigator.webkitGetGamepads();
			for (var pad = 0; pad < gamepads.length; pad++) {
				this.gamepad[pad].raw =  gamepads[pad];
				this.gamepad[pad].frame(delta);
			}
		}

		onMouseMove(e: MouseEvent): void {
			this.mouse.onMouseMove(e);
		}

		onMouseDown(e: MouseEvent): void {
			this.mouse.onMouseDown(e);
		}

		onMouseUp(e: MouseEvent): void {
			this.mouse.onMouseUp(e);
		}

		onKeyDown(e: KeyboardEvent): void {
			this.keyboard.onKeyDown(e);
		}

		onKeyUp(e: KeyboardEvent): void {
			this.keyboard.onKeyUp(e);
		}

	}

}