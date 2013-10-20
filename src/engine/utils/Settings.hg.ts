module HG {

	export class Settings {

		static fov = 110;
		static viewDistance = 500;
		static shadowMapSize = 2048;
		static antialiasing = true;
		static keys = {
			left: [KeyMap.A, KeyMap.Left],
			right: [KeyMap.D, KeyMap.Right],
			pause: KeyMap.Esc,
			jump: KeyMap.Space,
			devConsole: KeyMap.F12,
			fullscreen: KeyMap.F11
		};
		
	};

}