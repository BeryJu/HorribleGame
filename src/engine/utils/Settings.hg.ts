/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-06 15:08:10
*/
module HG {

	export class Settings {

		static fov = 110;
		static viewDistance = 5000;
		static shadowMapSize = 2048;
		static antialiasing = true;
		static debug = true;
		static keys = {
			forward: [KeyMap.W, KeyMap.Top],
			backward: [KeyMap.S, KeyMap.Bottom],
			left: [KeyMap.A, KeyMap.Left],
			right: [KeyMap.D, KeyMap.Right],
			pause: KeyMap.Esc,
			lower: KeyMap.Shift,
			jump: KeyMap.Space,
			devConsole: KeyMap.F12,
			refresh: KeyMap.F5,
			fullscreen: KeyMap.F11
		};
		
	};

}