/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-07 17:24:34
*/

module HG {
	
	export class ModuleLoader extends EventDispatcher {

		modules: string[] = ['fs', 'http', 'socket.io', 'socket.io-client'];

		constructor() {
			super();
			this.modules.forEach((m) => {
				console.log("[ModuleLoader] Required "+m);
				global[m] = require(m);
			});
			global.moduled = true;
		}

	}

}