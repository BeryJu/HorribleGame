/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:50:16
*/

module HG.Utils {

	export class ISettings {

		debug: boolean;

		// gfx options
		graphics: {
			fullscreen: boolean;
			fov: number;
			viewDistance: number;
			shadowMapSize: number;
			useStaticFramerate: boolean;
			staticFramerate: number;
			antialiasing: boolean;
			resolution: THREE.Vector2;
		};

		// sfx options
		sound: {
			masterVolume: number;
			channels: {
				effectsEnvVolume: number;
				effectsSelfVolume: number;
				musicVolume: number;
			}
		};

		keys: {
			forward: number[];
			backward: number[];
			left: number[];
			right: number[];
			pause: number[];
			lower: number[];
			jump: number[];
			devConsole: number[];
			refresh: number[];
			fullscreen: number[];
		};

	}

}