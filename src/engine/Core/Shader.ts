/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:04:23
*/

module HG.Core {

	export class Shader extends HG.Core.EventDispatcher {

		vertexShader: string;
		fragmentShader: string;

		constructor(path?: string) {
			super();
			if (path) {
				var shader = require("./" + path);
				this.load(shader);
			}
		}

		load(raw: {}): void {
			this.vertexShader = raw["vertex"];
			this.fragmentShader = raw["fragment"];
			this.dispatch("loaded");
		}

	}

}