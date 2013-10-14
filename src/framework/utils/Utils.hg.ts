module HG {
	export class Utils {
		static rgbToHex(r: number, g: number, b: number): number {
			var componentToHex = function(c) {
				c = Math.abs(Math.floor(c));
				if (c > 255) c = 255;
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}
			return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
		}

		static hasGL(): boolean {
			return (window.WebGLRenderingContext) ? true : false;
		}

		static setFullScreenMode(state: boolean): void {
			var whwnd = require('nw.gui').Window.get();
			if (state === true) {
				whwnd.enterFullscreen();
			} else {
				whwnd.leaveFullscreen();
			}
		}

		static reload(): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.reloadIgnoringCache();
		}

		static toggleFullScreenMode(): void {
			var whwnd = require('nw.gui').Window.get();
			whwnd.toggleFullscreen();
		}

		static openDevConsole(): void {
			require('nw.gui').Window.get().showDevTools();
		}

		static isNode(): boolean {
			return (process) ? true : false;
		}
	}
}