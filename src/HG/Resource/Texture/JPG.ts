/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 19:59:19
*/

module HG.Resource.Texture {

	export class JPG extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			var texture = THREE.ImageUtils.loadTexture(path);
			texture.anisotropy = HG.settings.graphics.anisotropy;
			this.dispatch("loaded", texture);
		}

	}

}