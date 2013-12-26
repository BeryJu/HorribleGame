/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 18:12:25
*/

module HG.Core {

	export class Shader {

		vertex: string;
		fragment: string;
		uniforms: HG.Core.Hash<string, any>;

		constructor(vertex: string, fragment: string) {
			this.vertex = vertex;
			this.fragment = fragment;
			this.uniforms = new HG.Core.Hash<string, any>();
		}

		toMaterial(): THREE.ShaderMaterial {
			var material = new THREE.ShaderMaterial({
				vertex: this.vertex,
				fragment: this.fragment,
				uniforms: this.uniforms
			});
			return material;
		}

		set(key: string, data: any): HG.Core.Shader {
			this.uniforms.set(key, data);
			return this;
		}

		extend(obj: HG.Core.Hash<string, any>): HG.Core.Shader {
			obj.forEach((k, v) => {
				this[k] = v;
			});
			return this;
		}

		extendTexture(textures: HG.Core.Hash<string, THREE.Texture>): HG.Core.Shader {
			textures.forEach((k: string, v: THREE.Texture) => {
				this.uniforms.set(k, {
					type: "t",
					value: v
				});
			});
			return this;
		}

	}

}