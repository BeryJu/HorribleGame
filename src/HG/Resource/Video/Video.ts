/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 13:14:56
*/

module HG.Resource.Video {

	export class Video extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			var domElement = document.createElement("video");
			domElement.src = path;
			domElement.load();
			var size = new THREE.Vector2(domElement.videoHeight, domElement.videoWidth);

			var entity = new HG.Entities.VideoEntity(domElement, size);

			this.dispatch("loaded", entity);
		}

	}

}