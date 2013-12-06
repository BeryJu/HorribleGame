/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 16:53:32
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

	export function bootstrap(gInstance: HG.Core.BaseGame): void {
		if (HG.settings.debug === true) {
			HG.Utils.profile("HG Profiling Frame", () => gInstance.render());
		}
		window.onresize = () => gInstance.onResize();
		window.onkeydown = (a: any) => gInstance.onKeyDown(a);
		window.onkeyup = (a: any) => gInstance.onKeyUp(a);
		window.onmousemove = (a: any) => gInstance.onMouseMove(a);
		window.onmousedown = (a: any) => gInstance.onMouseDown(a);
		window.onmouseup = (a: any) => gInstance.onMouseUp(a);
		var render;
		if (HG.settings.graphics	.useStaticFramerate === true) {
			render = () => { gInstance.render(); };
			setInterval(render, 1000 / HG.settings.graphics	.staticFramerate);
		} else {
			render = () => {
				gInstance.render();
				requestAnimationFrame(render);
			};
		}
		render();
	}

	export function profile(name: string, fn: () => any): void {
		console.profile(name);
		fn();
		console.profileEnd();
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