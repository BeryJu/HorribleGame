/* 
* @Author: BeryJu
* @Date:   2013-11-20 14:10:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-20 14:16:47
*/
module HG {

	export module Resource {

		export module Texture {

			export class PNG extends EventDispatcher implements HG.Resource.IFiletype {

				eventsAvailable: string[] = ["loaded"];

				load(path: string) {
					var loader = new THREE.ImageLoader();
					loader.addEventListener("load", (image) => {
						this.dispatch("loaded", image);
					});
					loader.load(path);
				}

			}

		}

	}

}