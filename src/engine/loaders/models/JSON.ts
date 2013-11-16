/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-16 17:34:26
*/
module HG {

	export module Loaders {

		export module Model {

			export class JSON extends EventDispatcher implements HG.Loaders.IFiletype {

				load(path: string, material?: THREE.MeshFaceMaterial) {
					global.fs.readFile(path, (err, data) => {
						var loader = new THREE.JSONLoader();
						var result = loader.parse(global.JSON.parse(data));
						var material = new THREE.MeshFaceMaterial(result.materials);
						var model = {
							geometry: result.geometry,
							material: material
						}
						this.dispatch("loaded", model);
					});
				}

			}

		}

	}

}