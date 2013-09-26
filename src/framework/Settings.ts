module HG {
	export var Settings = {
		fov: 110,
		tileSize: 50,
		viewDistance: 4800,
		debug: {
			Enabled: true,
			PositionX: 2000
		},
		shadowMapSize: 2048,
		colorKey: "3c",
		antialiasing: true,
		levelURL: "http://lina/dev/projects/HorribleGame/assets/levels/level.json",
		keys: {
			Left: HG.KeyMap.A,
			Right: HG.KeyMap.D,
			Pause: HG.KeyMap.Esc
		},
		pattern: [
			[
				[1, 1, 0, 0, 0, 0, 1, 1],
				[0, 0, 0, 0, 0, 0, 1, 1],
				[0, 0, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1]
			],
			[
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 1, 1, 0, 0, 0, 1]
			],
			[
				[1, 1, 1, 1, 0, 0, 0, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1]
			],
			[
				[1, 1, 1, 1, 0, 0, 0, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[1, 1, 1, 1, 0, 0, 0, 1]
			],
			[
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1]
			],
			[
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1],
				[1, 1, 0, 0, 0, 0, 1, 1]
			]
		]
	};
}