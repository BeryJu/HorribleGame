/*
* @Author: BeryJu
* @Date:   2013-12-20 12:33:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 17:33:00
*/

module HG.Core {

	export class Queue<K, T> extends HG.Core.EventDispatcher {

		entries: HG.Core.Hash<K, Function>;
		result: HG.Core.Hash<K, T>;
		progress: number;
		total: number;
		percentage: number;

		constructor() {
			super(["done", "progress"]);
			this.progress = 1;
			this.total = 0;
			this.percentage = 0;
			this.entries = new HG.Core.Hash<K, Function>();
			this.result = new HG.Core.Hash<K, T>();
		}

		call(name: K, fn: Function): HG.Core.Queue<K, T> {
			if (fn !== null) {
				this.entries.push(name, fn);
			}
			return this;
		}

		private next(): void {
			var entry = this.entries.shift();
			// entry: {
			//		key: K,
			//		value: Function
			// }
			if (entry.value !== null && entry.value !== undefined) {
				entry.value((data: T) => {
					this.result.push(entry.key, data);
					this.progress++;
					this.percentage = Math.round((100 / this.total) * this.progress);
					this.dispatch("progress", this);
					this.next();
				});
			} else {
				this.dispatch("done", this.result);
			}
		}

		start(): HG.Core.Queue<K, T> {
			this.total = this.entries.length + 1;
			this.dispatch("progress", this);
			this.next();
			return this;
		}

	}

}