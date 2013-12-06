/*
* @Author: BeryJu
* @Date:   2013-11-11 12:15:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 18:10:57
*/

module HG {

	export var settings: HG.Utils.ISettings;

}

module HG.Utils {

	export var defaultSettings: HG.Utils.ISettings = {
		debug: true,
		hgLocale: "locale/HG.locale.json",
		graphics: {
			fullscreen: false,
			fov: 110,
			viewDistance: 5000,
			shadowMapSize: 2048,
			useStaticFramerate: false,
			staticFramerate: 120,
			antialiasing: true,
			resolution: new THREE.Vector2(1280, 720)
		},
		sound: {
			masterVolume: 1,
			channels: {
				effectsEnvVolume: 0.7,
				effectsSelfVolume: 0.8,
				musicVolume: 0.7
			}
		},
		keys: {
			forward: [87, 38],
			backward: [83, 40],
			left: [65, 37],
			right: [68, 39],
			pause: [27],
			lower: [16],
			jump: [32],
			devConsole: [123],
			refresh: [116],
			fullscreen: [122]
		}
	};

}