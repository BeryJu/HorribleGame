/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-14 00:48:10
*/

module HG.Core {

	export class Shader {

		vertex: string = "";
		fragment: string = "";
		meta: {
			properties: {};
			type: string;
		} = {
			properties: {},
			type: ""
		};
		uniforms: {} = null;
		loader: HG.Resource.ResourceLoader;

		constructor(raw: HG.Scenes.Serializer.RawShaderDefinition,
				loader: HG.Resource.ResourceLoader) {
			this.loader = loader;
			this.vertex = raw.vertex;
			this.fragment = raw.fragment;
			this.meta = raw.meta;
		}

		parseUniforms(properties: {}): void {
			var uniforms = {};
			for (var k in this.meta.properties) {
				var rawUniform = this.meta.properties[k];
				uniforms[k] = {};
				if (k in properties) {
					uniforms[k]["texture"] = THREE.ImageUtils.
							loadTexture(this.loader.path(properties[k]));
				}
				uniforms[k]["type"] = rawUniform["type"];
				uniforms[k]["value"] = rawUniform["value"];
			}
			if (!("time" in uniforms)) {
				var timeUniform = {
					type: "f",
					value: 0
				};
				uniforms["time"] = timeUniform;
			}
			console.log(uniforms);
			this.uniforms = uniforms;
		}

		toMaterial(): THREE.ShaderMaterial {
			var material = new THREE.ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: this.vertex,
				fragmentShader: this.fragment
			});
			return material;
		}

	}

}