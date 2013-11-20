/* 
* @Author: BeryJu
* @Date:   2013-11-10 13:59:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 19:50:06
*/
module HG {
	
	export module Resource {

		export module Sound {

			export class WAV extends EventDispatcher implements HG.Resource.IFiletype {

				eventsAvailable: string[] = ["loaded"];

				load(path: string, context: AudioContext): void {
					// Load buffer asynchronously
					var request = new XMLHttpRequest();
					request.open("GET", path, true);
					request.responseType = "arraybuffer";

					request.onload = () => {
						context.decodeAudioData(request.response,(buffer) => {
							this.dispatch("loaded", buffer);
						}, (error) => {
							console.error('decodeAudioData error', error);
						});
					};

					request.send();
				}

			}

		}

	}

}