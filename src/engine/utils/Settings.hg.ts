/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-09 11:38:57
*/
module HG {

	export class Settings {

		static debug = true;

		//gfx options
		static Graphics = {
			fov: 110,
			viewDistance: 5000,
			shadowMapSize: 2048,
			useStaticFramerate: true,
			staticFramerate: 120,
			antialiasing: true,
			resolution: new THREE.Vector2(1280, 720)
		};

		//sfx options
		static Sound = {
			masterVolume: 1.0,
			effectsVolume: 0.8,
			musicVolume: 0.7
		};

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