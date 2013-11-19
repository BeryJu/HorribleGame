/* 
* @Author: BeryJu
* @Date:   2013-11-10 13:59:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 13:37:34
*/
module HG {
	
	export module Sound {

		export class BufferLoader {

			context: AudioContext;

			constructor(context: AudioContext) {
				this.context = context;
			}

			loadBuffer(url: string, onload: (buffer: AudioBuffer) => void): void {
				// Load buffer asynchronously
				var request = new XMLHttpRequest();
				request.open("GET", url, true);
				request.responseType = "arraybuffer";

				request.onload = () => {
					// Asynchronously decode the audio file data in request.response
					this.context.decodeAudioData(
						request.response,
						(buffer) => {
							if (!buffer) {
								alert('error decoding file data: ' + url);
								return;
							}
							onload(buffer);
						},
						(error) => {
							HG.error('decodeAudioData error', error);
						}
					);
				};

				request.onerror = function() {
					alert('BufferLoader: XHR error');
				};

				request.send();
			}

			load(urls: string[], cb: (buffers: AudioBuffer) => void): void {
				urls.forEach((url) => {
					this.loadBuffer(url, cb);
				});
			}


		}

	}

}