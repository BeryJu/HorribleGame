/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-28 02:28:42
*/

module HG.Resource.Texture {

	export class PNG extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			var texture = THREE.ImageUtils.loadTexture(path);
			texture.anisotropy = HG.settings.graphics.anisotropy;
			texture.wrapT = texture.wrapS = THREE.RepeatWrapping;
			this.dispatch("loaded", texture);
		}

	}

}