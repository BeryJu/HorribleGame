/*
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:26:47
*/

module HG.Utils {

	export interface IOptions {
		silent: boolean;
	}

}

module HG {

	export var _start: number = 0;
	export var _gl: boolean = false;
	export var _options: HG.Utils.IOptions = {
		silent: false
	};

	export function warn(...data: any[]): string {
		var time = new Date().getTime() - HG._start;
		var timeString = (time + "");
		var output = "[" + timeString + "] " + data.join("");
		if (HG._options.silent === false) {
			console.warn(output);
		}
		return output;
	}

	export function log(...data: any[]): string {
		var time = new Date().getTime() - HG._start;
		var timeString = (time + "");
		var output = "[" + timeString + "] " + data.join("");
		if (HG._options.silent === false) {
			console.log(output);
		}
		return output;
	}

	export function horrible(options?: HG.Utils.IOptions): any {
		HG._start = new Date().getTime();
		if (options) HG._options = options;
		try {
			HG.Modules.ui = require("nw.gui");
		} catch (e) {
			HG.log("UI not available, assuming Headless");
		}
		// process.on("uncaughtException", (err) => {
		// 	console.warn(err);
		// 	console.trace(err.trace);
		// });
		// Linq
		HG.LINQ.initialize();
		// GL detection
		HG._gl = HG.Utils.hasGL();
		// some Audio Polyfill
		if (typeof window !== "undefined") {
			window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
		}
		return HG;
	}

}

if (typeof module !== "undefined") {
	module.exports =  {
		horrible: HG.horrible
	};
}