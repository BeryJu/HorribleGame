///<reference path="GameComponent" />

module HG {
	export class FPSCounter extends GameComponent{
		private lastFrameTime: number = 0;
		private lastSecond: number = 0;
		private currentFrames: number = 0;

		private frameTime: number = 0;
		private fps: number = 0;

		constructor() {
			super();
			this.lastFrameTime = new Date().getTime();
		}

		getFPS(): number {
			return this.fps;
		}

		getFrameTime(): number {
			return this.frameTime;
		}

		frame(delta: number): void {
			var Now = new Date();
			var Diff = new Date(Now.getTime() - this.lastFrameTime);
			//FrameTime
			this.frameTime = Diff.getTime();
			this.lastFrameTime = Now.getTime();
			//FPS
			var FPSDiff = new Date(Now.getTime() - this.lastSecond);
			if (FPSDiff.getSeconds() > 0) {
				this.fps = this.currentFrames;
				this.currentFrames = 0;
				this.lastSecond = Now.getTime();
			}
			this.currentFrames ++;
		}
	}
}