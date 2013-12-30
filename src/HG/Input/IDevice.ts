/*
* @Author: BeryJu
* @Date:   2013-12-30 21:04:29
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 22:43:26
*/

module HG.Input {

	export interface IDevice {

		onKeyDown?: (e: KeyboardEvent) => void;
		onKeyUp?: (e: KeyboardEvent) => void;

		onMouseDown?: (e: MouseEvent) => void;
		onMouseUp?: (e: MouseEvent) => void;
		onMouseMove?: (e: MouseEvent) => void;

		frame: (delta: number) => void;

	}

}