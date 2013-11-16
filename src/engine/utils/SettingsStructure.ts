/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-11 13:05:31
*/
module HG {

	export class SettingsStructure {

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
			forward: string[];
			backward: string[];
			left: string[];
			right: string[];
			pause: string[];
			lower: string[];
			jump: string[];
			devConsole: string[];
			refresh: string[];
			fullscreen: string[];
		};
		
	}

}