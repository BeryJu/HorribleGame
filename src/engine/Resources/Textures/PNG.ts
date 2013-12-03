/*
* @Author: BeryJu
* @Date:   2013-11-20 14:10:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 19:10:57
*/

module HG.Resource.Texture {

	export class PNG extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			var loader = new THREE.ImageLoader();
			HG.locale.core.errors.notImplementedError.error();

			// loader.addEventListener("load", (image) => {
			// 	this.dispatch("loaded", image);
			// });
			// loader.load(path);
		}

	}

}