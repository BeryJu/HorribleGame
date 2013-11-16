/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-09 00:23:58
*/

module HG {

	export module Utils {

		export class FPSCounter {

			private lastFrameTime: number = 0;
			private lastSecond: number = 0;
			private currentFrames: number = 0;
			private highestFPS: number = 0;

			private _frameTime: number = 0;
			private fps: number = 0;

			constructor() {
				this.lastFrameTime = new Date().getTime();
			}

			get FPS(): number {
				return this.fps;
			}

			get maxFPS(): number {
				return this.highestFPS;
			}

			get frameTime(): number {
				return this._frameTime;
			}

			frame(delta: number): void {
				var Now = new Date();
				var Diff = new Date(Now.getTime() - this.lastFrameTime);
				//FrameTime
				this._frameTime = Diff.getTime();
				this.lastFrameTime = Now.getTime();
				//FPS
				var FPSDiff = new Date(Now.getTime() - this.lastSecond);
				if (FPSDiff.getSeconds() > 0) {
					this.fps = this.currentFrames;
					if (this.fps > this.highestFPS) 
						this.highestFPS = this.fps;
					this.currentFrames = 0;
					this.lastSecond = Now.getTime();
				}
				this.currentFrames ++;
			}
		}
		
	}
}