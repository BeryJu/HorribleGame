/*
* @Author: BeryJu
* @Date:   2013-11-20 14:10:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 19:30:10
*/

module HG.Resource.Texture {

	export class PNG extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			this.dispatch("loaded", THREE.ImageUtils.loadTexture(path));
		}

	}

}