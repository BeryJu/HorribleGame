/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/

module HG {
	
	export class Shader extends EventDispatcher {

		vertexShader: string;
		fragmentShader: string;

		constructor(path?: string) {
			super();
			if (path) {
				var shader = require('./'+path);
				this.load(shader)
			}
		}

		load(raw: {}): void {
			this.vertexShader = raw['vertex'];
			this.fragmentShader = raw['fragment'];
			this.dispatch('loaded');
		}

	}

}