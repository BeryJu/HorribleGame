/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 21:34:43
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
			if (this.uniforms.indexOf("time") === -1) {
				this.set("time", {
					type: "f",
					value: 0.0
				});
			}
			var params = {
				vertexShader: this.vertex,
				fragmentShader: this.fragment,
				uniforms: this.uniforms.toNativeHash()
			};
			var material = new THREE.ShaderMaterial(params);
			return material;
		}

		set(key: string, data: any): HG.Core.Shader {
			this.uniforms.push(key, data);
			return this;
		}

		extend(obj: HG.Core.Hash<string, any>): HG.Core.Shader {
			obj.forEach((k, v) => {
				this.uniforms.push(k,v);
			});
			return this;
		}

		extendTexture(textures: HG.Core.Hash<string, THREE.Texture>): HG.Core.Shader {
			textures.forEach((k: string, v: THREE.Texture) => {
				v.wrapS = v.wrapT = THREE.RepeatWrapping;
				this.uniforms.push(k + "Texture", {
					type: "t",
					value: v
				});
			});
			return this;
		}

	}

}