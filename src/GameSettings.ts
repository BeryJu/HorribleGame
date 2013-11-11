/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-11 13:06:06
*/
class GameSettings extends HG.SettingsStructure {

	debug = true;

	//gfx options
	Graphics = {
		fullscreen: false,
		fov: 110,
		viewDistance: 5000,
		shadowMapSize: 2048,
		useStaticFramerate: true,
		staticFramerate: 120,
		antialiasing: true,
		resolution: new THREE.Vector2(1280, 720)
	};

	//sfx options
	Sound = {
		masterVolume: 1.0,
		channels: {
			effectsEnvVolume: 0.7,
			effectsSelfVolume: 0.8,
			musicVolume: 0.7
		}
	};

	Keys = {
		forward: [HG.KeyMap.W, HG.KeyMap.Top],
		backward: [HG.KeyMap.S, HG.KeyMap.Bottom],
		left: [HG.KeyMap.A, HG.KeyMap.Left],
		right: [HG.KeyMap.D, HG.KeyMap.Right],
		pause: [HG.KeyMap.Esc],
		lower: [HG.KeyMap.Shift],
		jump: [HG.KeyMap.Space],
		devConsole: [HG.KeyMap.F12],
		refresh: [HG.KeyMap.F5],
		fullscreen: [HG.KeyMap.F11]
	};
	
}