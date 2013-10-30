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

		export function degToRad(deg: number): number {
			return deg * Math.PI / 180;
		}

		export function hasGL(): boolean {
			return (window.WebGLRenderingContext) ? true : false;
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

		export function isNode(): boolean {
			return (process) ? true : false;
		}
	}
}