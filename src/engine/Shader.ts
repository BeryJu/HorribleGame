/*
* Shader.ts
* Author: BeryJU
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