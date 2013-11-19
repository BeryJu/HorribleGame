/* 
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 13:46:29
*/
module HG {

	export function warn(...args: any[]): void {
		if (!HG.__SILENT && HG.__SILENT !== true) {
			args.splice(0, 0, "["+(new Date().getTime() - HG.__START)+"]");
			console.warn.apply(console, args);
		}
	}

	export function error(...args: any[]): void {
		if (!HG.__SILENT && HG.__SILENT !== true) {
			args.splice(0, 0, "["+(new Date().getTime() - HG.__START)+"]");
			console.error.apply(console, args);
		}
	}

	export function log(...args: any[]): void {
		if (!HG.__SILENT && HG.__SILENT !== true) {
			args.splice(0, 0, "["+(new Date().getTime() - HG.__START)+"]");
			console.log.apply(console, args);
		}
	}

	export var __START: number = 0;
	export var __SILENT: boolean = false;

	export function horrible(): void {
		this.__START = new Date().getTime();
		process.on('uncaughtException', (err) => {
			HG.warn(err);
			console.trace();
		});

		//Linq
		HG.LINQ.initialize();
		//GL detection
		if (HG.Utils.hasGL() === false) HG.warn(
			new Error("Runtime or Graphiscard doesn't support GL"));
		//Audio
		if (typeof window !== "undefined") {
			window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext'];
		}
	}

}

if (typeof module !== "undefined") {
	module.exports = (args: { silent: boolean } = { silent: false }) => {
		HG.__SILENT = args.silent;
		HG.horrible();

		return HG;
	};
}