/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 17:28:29
*/

module HG.Utils {

	export class FPSCounter {

		private lastFrameTime: number = 0;
		private lastSecond: number = 0;
		private currentFrames: number = 0;
		private highestFPS: number = 0;

		private _frameTime: number = 0;
		private _fps: number = 0;

		constructor() {
			this.lastFrameTime = new Date().getTime();
		}

		get FPS(): number {
			return this._fps;
		}

		get maxFPS(): number {
			return this.highestFPS;
		}

		get frameTime(): number {
			return this._frameTime;
		}

		frame(delta: number): void {
			var now = new Date();
			var diff = new Date(now.getTime() - this.lastFrameTime);
			// FrameTime
			this._frameTime = diff.getTime();
			this.lastFrameTime = now.getTime();
			// FPS
			var fpsDiff = new Date(now.getTime() - this.lastSecond);
			if (fpsDiff.getSeconds() > 0) {
				this._fps = this.currentFrames;
				if (this._fps > this.highestFPS)
					this.highestFPS = this._fps;
				this.currentFrames = 0;
				this.lastSecond = now.getTime();
			}
			this.currentFrames ++;
		}
	}

}