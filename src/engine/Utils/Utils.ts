/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 17:27:52
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

	export function isFunction(va: any): boolean {
		return (typeof va === "function");
	}

	export function isUndefined(va: any): boolean {
		return (typeof va === "undefined");
	}

	export function isNumber(va: any): boolean {
		return (typeof va === "number");
	}

	export function bootstrap(game: HG.Core.BaseGame): void {
		if (HG.settings.debug === true) {
			HG.Utils.profile("HG Profiling Frame", () => game.render());
		}
		window.onresize = () => game.onResize();
		window.onkeydown = (a: any) => game.onKeyDown(a);
		window.onkeyup = (a: any) => game.onKeyUp(a);
		window.onmousemove = (a: any) => game.onMouseMove(a);
		window.onmousedown = (a: any) => game.onMouseDown(a);
		window.onmouseup = (a: any) => game.onMouseUp(a);
		var render;
		if (HG.settings.graphics.useStaticFramerate === true) {
			render = () => { game.render(); };
			setInterval(render, 1000 / HG.settings.graphics	.staticFramerate);
		} else {
			render = () => {
				game.render();
				requestAnimationFrame(render);
			};
		}
		render();
	}

	export function devTools(): any {
		var whnd = HG.Modules.ui.Window.get();
		var devToolsWindow = whnd.showDevTools();
		devToolsWindow.resizeTo(1280, 720);
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