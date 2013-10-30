/*
* ModuleLoader.ts
* Author: BeryJu
*/

module HG {
	
	export class ModuleLoader extends EventDispatcher {

		modules: string[] = ['fs', 'http', 'socket.io', 'socket.io-client'];

		constructor() {
			super();
			for (var i = 0; i < this.modules.length; i++) {
				console.log("[ModuleLoader] Required "+this.modules[i]);
				global[this.modules[i]] = require(this.modules[i]);
			}
			// this.modules.forEach((m) => {
			// 	console.log("[ModuleLoader] Required "+m);
			// 	global[m] = require(m);
			// });
		}

	}

}