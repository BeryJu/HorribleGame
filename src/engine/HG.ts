/* 
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:24:54
*/
module HG {

	export var _warn: (message?: any, ...optionalParams: any[]) => void;
	export var _error: (message?: any, ...optionalParams: any[]) => void;
	export var _log: (message?: any, ...optionalParams: any[]) => void;

	export function horrible(): void {
		HG._warn = console.warn;
		HG._error = console.error;
		HG._log = console.log;
		
		console.log = (...msg: any[]) => {
			if (!HG["SILENT"] && HG["SILENT"] !== true) {
				HG._log.apply(console, msg);
			}
		};

		console.warn = (...msg: any[]) => {
			if (!HG["SILENT"] && HG["SILENT"] !== true) {
				HG._warn.apply(console, msg);
			}
		};

		console.error = (...msg: any[]) => {
			if (!HG["SILENT"] && HG["SILENT"] !== true) {
				HG._error.apply(console, msg);
			}
		};
	}

}