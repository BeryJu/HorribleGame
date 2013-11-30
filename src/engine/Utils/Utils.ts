/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 02:36:03
*/

module HG.Utils {

	export function rgbToHex(r: number, g: number, b: number): number {
		var componentToHex = (c) => {
			c = Math.abs(Math.floor(c));
			if (c > 255) c = 255;
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		}
		return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
	}

	export function bootstrap(gInstance: HG.Core.BaseGame, wnd: Window): void {
		if (HG.Settings.debug === true) {
			HG.Utils.profile(() => {
				gInstance.render();
			});
		}
		wnd.onresize = () => gInstance.onResize();
		wnd.onkeydown = (a: any) => gInstance.onKeyDown(a);
		wnd.onkeyup = (a: any) => gInstance.onKeyUp(a);
		wnd.onmousemove = (a: any) => gInstance.onMouseMove(a);
		wnd.onmousedown = (a: any) => gInstance.onMouseDown(a);
		wnd.onmouseup = (a: any) => gInstance.onMouseUp(a);
		if (HG.Settings.Graphics.useStaticFramerate === true) {
			var render = () => { gInstance.render(); };
			setInterval(render, 1000 / HG.Settings.Graphics.staticFramerate);
			render();
		} else {
			var render = () => { gInstance.render(); requestAnimationFrame(render); };
			render();
		}
	}

	export function profile(fn: () => any): void {
		console.profile("HG Profile");
		fn();
		console.profileEnd();
	}

	export function hasGL(): boolean {
		var wnd = (typeof window !== "undefined") ? true : false;
		if (wnd === false) return false;
		var gl = (window['WebGLRenderingContext']) ? true : false;
		return wnd && gl;
	}

}