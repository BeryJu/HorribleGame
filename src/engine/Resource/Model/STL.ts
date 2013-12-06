/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:01:58
*/

module HG.Resource.Model {

	export class STL extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string, material?: THREE.MeshFaceMaterial) {
			var loader = new THREE.STLLoader();
			loader.addEventListener("load", (event) => {
				var geometry = event.content;
				var phong = new THREE.MeshPhongMaterial({
					ambient: 0xff5533,
					color: 0xff5533,
					specular: 0x111111,
					shininess: 200
				});
				var material = new THREE.MeshFaceMaterial([phong]);
				// var material = new THREE.MeshBasicMaterial({
				// 	map: THREE.ImageUtils.loadTexture("assets/textures/skybox/xneg.png")
				// });
				var model = {
					geometry: geometry,
					material: material
				};
				this.dispatch("loaded", model);
			});
			loader.load(path);
		}

	}

}