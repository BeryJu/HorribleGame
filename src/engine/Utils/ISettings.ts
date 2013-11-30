/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 20:19:40
*/

module HG.Utils {

	export class ISettings {

		debug: boolean = true;

		//gfx options
		Graphics: {
			fullscreen: boolean;
			fov: number;
			viewDistance: number;
			shadowMapSize: number;
			useStaticFramerate: boolean;
			staticFramerate: number;
			antialiasing: boolean;
			resolution: THREE.Vector2;
		};

		//sfx options
		Sound: {
			masterVolume: number;
			channels: {
				effectsEnvVolume: number;
				effectsSelfVolume: number;
				musicVolume: number;
			}
		};

		Keys: {
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