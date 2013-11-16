/* 
* @Author: BeryJu
* @Date:   2013-11-07 16:30:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-16 14:19:03
*/
module HG {

	export module Utils {

		export class Bootstrapper extends EventDispatcher {

			eventsAvailable: string[] = ['error'];

			constructor() {
				super();
				process.on('uncaughtException', (err) => {
					this.dispatch('error', err.message);
				});
				// window.addEventListener('error', (e) => {
				// 	this.dispatch('error', (<ErrorEvent> e).message);
				// 	e.preventDefault();
				// });
				this.on('error');
			}

			bootstrap(): void {
				//Linq
				HG.LINQ.initialize();
				//Physics
				Physijs.scripts = {
					ammo: "ammo.js",
					worker: "lib/physijs_worker.js"
				};
				//Settings
				if (!HG.Settings) {
					HG.Settings = HG.loadSettings("assets/settings/defaultSettings.json");
				}
				//GL detection
				if (HG.Utils.hasGL() === false) this.dispatch('error', 
					new Error("Runtime or Graphiscard doesn't support GL"));
				//Audio
				window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext'];
			}

			error(error: string, ...args: any[]): void {
				console.warn(error);
				console.trace();
			}

		}

	}

}