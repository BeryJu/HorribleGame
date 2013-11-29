/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:42:14
*/

module HG.Resource.Model {

	export class JS extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

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