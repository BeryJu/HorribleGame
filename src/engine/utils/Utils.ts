/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 13:36:53
*/
module HG {
	export module Utils {
		export function rgbToHex(r: number, g: number, b: number): number {
			var componentToHex = (c) => {
				c = Math.abs(Math.floor(c));
				if (c > 255) c = 255;
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}
			return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
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

		export function resize(resolution: THREE.Vector2): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.width = resolution.x;
			whwnd.height = resolution.y;
		}

		export function position(position: THREE.Vector2): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.x = position.x;
			whwnd.y = position.y;
		}

		export function setFullScreenMode(state: boolean): void {
			var whwnd = require('nw.gui').Window.get();
			if (state === true) {
				whwnd.enterFullscreen();
			} else {
				whwnd.leaveFullscreen();
			}
		}

		export function reload(): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.reloadIgnoringCache();
		}

		export function toggleFullScreenMode(): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.toggleFullscreen();
		}

		export function openDevConsole(): void {
			require('nw.gui').Window.get().showDevTools();
		}

		export function openDevConsoleExternal(): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.showDevTools('', true);
			whwnd.on("devtools-opened", function(url) {
				HG.log(url);
				require("openurl").open(url.toString());
			});
		}

		export function isNode(): boolean {
			return (process) ? true : false;
		}
	}
}