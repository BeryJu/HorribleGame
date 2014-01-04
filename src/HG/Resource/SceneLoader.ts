/*
* @Author: BeryJu
* @Date:   2014-01-04 15:34:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 17:36:23
*/

module HG.Resource {

	export class SceneLoader extends HG.Core.EventDispatcher {

		scene: HG.Core.Scene;
		queue: HG.Core.Queue<number, HG.Entities.Entity>;
		callIndex: number;
		startTime: number;

		set color(color: THREE.Color) {
			this.scene.color = color;
		}

		set colorAlpha(alpha: number) {
			this.scene.colorAlpha = alpha;
		}

		constructor() {
			super(["done", "progress"]);
			this.scene = new HG.Core.Scene();
			this.queue = new HG.Core.Queue<number, HG.Entities.Entity>();
			this.queue.on("progress", (queue: HG.Core.Queue<number, HG.Entities.Entity>) => {
				this.dispatch("progress", queue);
			});
			this.queue.on("done", (result: HG.Core.Hash<number, HG.Entities.Entity>) => {
				result.forEach((v: HG.Entities.Entity) => {
					this.scene.push(v);
				});
				var now = new Date().getTime();
				var diff = new Date(now - this.startTime);
				this.dispatch("done", this.scene, diff);
			});
			this.callIndex = 0;
		}

		step(fn: (done: (data: HG.Entities.Entity) => any) => any): HG.Resource.SceneLoader {
			this.queue.call(this.callIndex, fn);
			this.callIndex++;
			return this;
		}

		start(): void {
			this.startTime = new Date().getTime();
			this.queue.start();
		}

	}

}