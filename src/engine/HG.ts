/*
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 22:23:28
*/

module HG {

	export var __start: number = 0;
	export var __gl: boolean = false;
	export var __options: HG.Utils.IOptions = {
		silent: false
	};

	export module Utils {

		export interface IOptions {
			silent: boolean;
		}

	}

	export function log(...data: any[]): string {
		var time = (new Date().getTime() - HG.__start).toString();//.lengthen(6);
		var output = "["+time+"] "+data.join("");
		if (HG.__options.silent === false) {
			console.log(output);
		}
		return output;
	}

	export function horrible(options: HG.Utils.IOptions): any {
		HG.__start = new Date().getTime();
		HG.__options = options;
		try {
			HG.Modules.ui = require('nw.gui');
		} catch (e) {}
		// process.on('uncaughtException', (err) => {
		// 	console.warn(err);
		// 	console.trace(err.trace);
		// });
		// Linq
		HG.LINQ.initialize();
		// GL detection
		HG.__gl = HG.Utils.hasGL();
		// some Audio Polyfill
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