/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-16 17:26:47
*/

module HG {
	
	export module Utils {
		
		export class ModuleLoader extends EventDispatcher {

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

}