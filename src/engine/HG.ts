/*
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 19:18:42
*/
module HG {

	export var __START: number = 0;

	export function horrible(): any {
		HG.__START = new Date().getTime();
		// process.on('uncaughtException', (err) => {
		// 	console.warn(err);
		// 	console.trace(err.trace);
		// });
		//Linq
		HG.LINQ.initialize();
		//GL detection
		if (HG.Utils.hasGL() === false)
			console.warn(new Error("Runtime or Graphiscard doesn't support GL"));
		//Audio
		if (typeof window !== "undefined") {
			window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext'];
		}
		return HG;
	}

}

if (typeof module !== "undefined") {
	module.exports =  {
		horrible: HG.horrible
	};
}