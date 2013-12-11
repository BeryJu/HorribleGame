/*
* @Author: BeryJu
* @Date:   2013-11-10 13:59:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 17:59:27
*/

module HG.Resource.Sound {

	export class WAV extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string): void {
			// Load buffer asynchronously
			var request = new XMLHttpRequest();
			request.open("GET", path, true);
			request.responseType = "arraybuffer";

			request.onload = () => {
				new AudioContext().decodeAudioData(request.response, (buffer) => {
					this.dispatch("loaded", buffer);
				}, (error) => {
					console.error("decodeAudioData error", error);
				});
			};

			request.send();
		}

	}

}