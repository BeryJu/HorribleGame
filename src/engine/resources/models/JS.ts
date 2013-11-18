/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:50:04
*/
module HG {

	export module Resource {

		export module Model {

			export class JS extends EventDispatcher implements HG.Resource.IFiletype {

				load(path: string) {
					global.fs.readFile(path, (err, data) => {
						var loader = new THREE.JSONLoader();
						var result = loader.parse(JSON.parse(data));
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