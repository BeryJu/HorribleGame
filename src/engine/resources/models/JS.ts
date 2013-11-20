/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 20:35:43
*/
module HG {

	export module Resource {

		export module Model {

			export class JS extends EventDispatcher implements HG.Resource.IFiletype {

				eventsAvailable: string[] = ["loaded"];

				load(path: string) {
					var loader = new THREE.JSONLoader();
					loader.load(path, (geometry, material) => {
						var model = {
							geometry: geometry,
							material: material
						}
						this.dispatch("loaded", model);
					});
				}

			}

		}

	}

}