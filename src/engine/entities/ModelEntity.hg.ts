/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-12 17:07:46
*/
/// <reference path="BaseEntity.hg.ts" />

module HG {
	
	export module Entities {

		export class ModelEntity extends BaseEntity {

			object: THREE.Mesh;
			eventsAvailable: string[] = ["loaded"];

			fromSTL(path: string): void {
				var loader = new THREE.STLLoader();
				loader.addEventListener('load', (event) => {
					var geometry = event.content;
					var material = new THREE.MeshPhongMaterial( { ambient: 0xff5533, color: 0xff5533, specular: 0x111111, shininess: 200 } );
					var real = new THREE.MeshFaceMaterial([material]);
					this.load(geometry, real);
				});
				loader.load(path);
				// global.fs.readFile(path, (err, data) => {
				// 	var loader = new THREE.STLLoader();
				// 	var parsed = loader.parse(data);
				// 	var material = new THREE.MeshPhongMaterial( { ambient: 0xff5533, color: 0xff5533, specular: 0x111111, shininess: 200 } );
				// 	this.load(parsed.content, material);
				// });
			}

			fromJS(path: string): void {
				global.fs.readFile(path, (err, data) => {
					var loader = new THREE.JSONLoader();
					var result = loader.parse(JSON.parse(data));
					var material = new THREE.MeshFaceMaterial(result.materials);
					this.load(result.geometry, material);
				});
			}

			load(geometry: THREE.Geometry, material: THREE.MeshFaceMaterial): void {
				this.object = new THREE.Mesh(geometry, material);
				this.dispatch('loaded', geometry, material);
			}

		}

	}

}
