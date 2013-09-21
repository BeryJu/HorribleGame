module HG {
	export class FPSCounter {
		private LastFrameTime: number = 0;
		private LastSecond: number = 0;
		private CurrentFrameTime: number = 0;
		private CurrentFrames: number = 0;

		private FrameTime: number = 0;
		private FPS: number = 0;

		constructor() {
			this.LastFrameTime = new Date().getTime();
		}

		getFPS(): number {
			return this.FPS;
		}

		getFrameTime(): number {
			return this.FrameTime;
		}

		Frame(): void {
			var Now = new Date();
			var Diff = new Date(Now.getTime() - this.LastFrameTime);
			//FrameTime
			this.CurrentFrameTime = Diff.getTime();
			this.LastFrameTime = Now.getTime();
			//FPS
			var FPSDiff = new Date(Now.getTime() - this.LastSecond);
			if (FPSDiff.getSeconds() > 0) {
				this.FPS = this.CurrentFrames;
				this.FrameTime = this.CurrentFrameTime;
				this.CurrentFrames = 0;
				this.LastSecond = Now.getTime();
			}
			this.CurrentFrames ++;
		}
	}
}