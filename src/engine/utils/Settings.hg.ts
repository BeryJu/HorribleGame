module HG {

	export class Settings {

		static fov = 110;
		static viewDistance = 500;
		static shadowMapSize = 2048;
		static antialiasing = true;
		static keys = {
			left: [HG.KeyMap.A, HG.KeyMap.Left],
			right: [HG.KeyMap.D, HG.KeyMap.Right],
			pause: HG.KeyMap.Esc,
			jump: HG.KeyMap.Space,
			devConsole: HG.KeyMap.F12,
			fullscreen: HG.KeyMap.F11
		};
		
	};

}