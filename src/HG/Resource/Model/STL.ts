/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-25 01:17:50
*/

module HG.Resource.Model {

	export class STL extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string, material?: THREE.MeshFaceMaterial) {
			var loader = new THREE.STLLoader();
			loader.addEventListener("load", (event) => {
				var geometry = event.content;
				this.dispatch("loaded", geometry);
			});
			loader.load(path);
		}

	}

}