/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-08 23:43:43
*/
/// <reference path="BaseEntity.hg.ts" />

module HG {
	
	export module Entities {

		export class ModelEntity extends BaseEntity {

			object: THREE.Mesh;
			eventsAvailable: string[] = ["loaded"];

			fromSTL(path: string): void {
				global.fs.readFile(path, (err, data) => {
					var sloader = new THREE.STLLoader();
					var a = sloader.parse(data);
					console.log(a);
				});
			}

			fromJS(path: string): void {
				global.fs.readFile(path, (err, data) => {
					var loader = new THREE.JSONLoader();
					var result = loader.parse(JSON.parse(data));
					this.load(result.geometry, result.materials);
				});
			}

			load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void {
				var material = new THREE.MeshFaceMaterial(materials);
				this.object = new THREE.Mesh(geometry, material);
				this.dispatch('loaded', geometry, material);
			}

		}

	}

}
