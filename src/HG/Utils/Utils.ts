/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-19 18:22:00
*/

module HG.Utils {

	export function rgbToHex(r: number, g: number, b: number): number {
		var componentToHex = (c) => {
			c = Math.abs(Math.floor(c));
			if (c > 255) c = 255;
			var hex = c.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		};
		return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
	}

	export function parseColor(raw: any): THREE.Color {
		var color = new THREE.Color(0xaabbcc);
		if (Array.isArray(raw) === true) {
			color.setRGB.apply(color, raw);
		} else {
			color.setHex(raw);
		}
		return color;
	}

	export function isFunction(va: any): boolean {
		return (typeof va === "function");
	}

	export function isNumber(va: any): boolean {
		return (typeof va === "number");
	}

	export function devTools(): any {
		var whnd = HG.Modules.ui.Window.get();
		var devToolsWindow = whnd.showDevTools();
		devToolsWindow.resizeTo(HG.settings.graphics.devToolsResolution.x,
				HG.settings.graphics.devToolsResolution.y);
		devToolsWindow.setPosition("center");
		return devToolsWindow;
	}

	export function profile(label: string, fn: () => any): void {
		console.profile(label);
		fn();
		console.profileEnd();
	}

	export function time(label: string, fn: () => any): void {
		console.time(label);
		fn();
		console.timeEnd(label);
	}

	export function hasGL(): boolean {
		var wnd = (typeof window !== "undefined") ? true : false;
		if (wnd === false) {
			return false;
		} else {
			var gl = (window["WebGLRenderingContext"]) ? true : false;
			return wnd && gl;
		}
	}

}