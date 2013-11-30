/*
* @Author: BeryJu
* @Date:   2013-11-20 14:10:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 00:50:15
*/

module HG.Resource.Texture {

	export class PNG extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			var loader = new THREE.ImageLoader();
			throw new Error("NotImplementedError");

			// loader.addEventListener("load", (image) => {
			// 	this.dispatch("loaded", image);
			// });
			// loader.load(path);
		}

	}

}