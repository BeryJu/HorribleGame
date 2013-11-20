/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-20 14:39:54
*/
module HG {

	export module Resource {

		export module Model {

			export class STL extends EventDispatcher implements HG.Resource.IFiletype {

				eventsAvailable: string[] = ["loaded"];

				load(path: string, material?: THREE.MeshFaceMaterial) {
					var loader = new THREE.STLLoader();
					loader.addEventListener('load', (event) => {
						var geometry = event.content;
						// var phong = new THREE.MeshPhongMaterial({
						// 	ambient: 0xff5533,
						// 	color: 0xff5533,
						// 	specular: 0x111111,
						// 	shininess: 200
						// });
						// var material = new THREE.MeshFaceMaterial([phong]);
						var material = new THREE.MeshBasicMaterial({
							map: THREE.ImageUtils.loadTexture("assets/textures/skybox/xneg.png")
						});
						var model = {
							geometry: geometry,
							material: material
						}
						this.dispatch("loaded", model);
					});
					loader.load(path);
				}

			}

		}

	}

}