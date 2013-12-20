/*
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 11:46:40
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
		return data.join("");
	}

	export function forceLog(...data: any[]): string {
		var time = new Date().getTime() - HG._start;
		var timeString = (time + "");
		var output = "[" + timeString + "] " + data.join("");
		console.log(output);
		return data.join("");
	}

	export function log(...data: any[]): string {
		var time = new Date().getTime() - HG._start;
		var timeString = (time + "");
		var output = "[" + timeString + "] " + data.join("");
		if (HG._options.silent === false) {
			console.log(output);
		}
		return data.join("");
	}

	export function horrible(options?: HG.Utils.IOptions): any {
		HG._start = new Date().getTime();
		if (options) HG._options = options;
		try {
			HG.Modules.ui = require("nw.gui");
		} catch (e) {
			HG.log("UI not available, assuming Headless");
		}
		// Linq
		var registerFunction = function (key: string, type: any, fn: (...args: any[]) => any) {
			type[key] = function () {
				var args = Array.prototype.slice.call(arguments);
				args.splice(0, 0, this);
				return fn.apply(this, args);
			};
		};
		for (var type in HG.LINQ) {
			if (type.toString() !== "initialize") {
				var provider = <HG.LINQ.IProvider> new HG.LINQ[type]();
				var prototype = provider._prototype;
				for (var member in provider) {
					if (member !== "_prototype") {
						registerFunction(member, prototype, provider[member]);
					}
				}
			}
		}
		// GL detection
		HG._gl = HG.Utils.hasGL();
		// some Audio Polyfill
		if (typeof window !== "undefined") {
			window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
		}
		return HG;
	}

}

var query;
if (typeof document !== "undefined") {
	query = (selector: string) => {
		return document.querySelector.call(document, selector);
	};
}

// CommonJS/Node support
if (typeof module !== "undefined") {
	module.exports =  {
		horrible: HG.horrible
	};
}