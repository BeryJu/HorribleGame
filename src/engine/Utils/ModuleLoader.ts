/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:46:12
*/

module HG.Utils {

	export class ModuleLoader extends HG.Core.EventDispatcher {

		modules: string[] = ['fs', 'path', 'http', 'socket.io', 'socket.io-client'];

		constructor(additional: string[] = []) {
			super();
			this.modules.concat(additional);
			this.modules.forEach((m) => {
				console.log("[ModuleLoader] Required "+m);
				global[m] = require(m);
			});
		}

	}

}