/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 13:39:52
*/

module HG.Resource.Video {

	export class OGV extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string) {
			var domElement = document.createElement("video");
			domElement.src = path;
			domElement.load();

			this.dispatch("loaded", domElement);
		}

	}

}