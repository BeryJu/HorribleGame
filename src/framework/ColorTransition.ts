///<reference path="GameComponent" />

module HG {

	export class ColorTransition extends GameComponent {

		private baseColor: HG.rgb;
		private currentColor: HG.rgb;
		private targets: HG.rgb[];
		private currentTarget: number;
		private isDone: boolean = false;
		private currentFrame: number;
		private frameSpan: number;

		constructor() {
			super();
			this.baseColor = new HG.rgb();
			this.currentColor = new HG.rgb();
			this.currentFrame = 0;
			this.frameSpan = 0;
			this.currentTarget = 0;
			this.targets = [];
		}

		getColor(): THREE.Color {
			var c = new THREE.Color();
			c.r = this.currentColor.r;
			c.g = this.currentColor.g;
			c.b = this.currentColor.b;
			return c;
		}

		target(color: HG.rgb): ColorTransition {
			this.targets.push(color);
			this.dispatch('targetAdded', color);
			return this;
		}

		over(frames: number): ColorTransition {
			this.frameSpan = frames;
			return this;
		}

		from(color: HG.rgb): ColorTransition {
			this.baseColor = color;
			return this;
		}

		frame(delta: number): void {
			if (this.currentFrame >= this.frameSpan) {
				this.isDone = true;
				this.dispatch('done', this);
			} else {
				if (this.currentColor === this.targets[this.currentTarget]) {
					this.currentTarget ++;
					this.currentFrame = 0;
					if (this.currentTarget > this.targets.length) {
						this.isDone = true;
						this.dispatch('done', this);
					}
				} else {
					var target = this.targets[this.currentTarget];
					var r = this.increment(this.currentColor.r, target.r, delta, this.frameSpan - this.currentTarget);
					var g = this.increment(this.currentColor.g, target.g, delta, this.frameSpan - this.currentTarget);
					var b = this.increment(this.currentColor.b, target.b, delta, this.frameSpan - this.currentTarget);

					console.log(r);
					console.log(g);
					console.log(b);
					this.currentColor.r += r;
					this.currentColor.g += g;
					this.currentColor.b += b;
				}
				this.currentFrame ++;
			}
		}

		increment(from: number, to: number, delta: number, framesLeft: number): number {
			return ((to - from) / framesLeft);
		}

	}

}