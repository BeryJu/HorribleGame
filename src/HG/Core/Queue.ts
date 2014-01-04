/*
* @Author: BeryJu
* @Date:   2013-12-20 12:33:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 02:08:44
*/

module HG.Core {

	// export function queue<K, T>(functions: HG.Core.Hash<K, Function>,
	// 			done: (data: HG.Core.Hash<K, T>) => void) {
	// 	var allData = new HG.Core.Hash<K, T>();
	// 	var next = (index: number, data?: T, key?: K) => {
	// 		if (index !== 0) {
	// 			allData.push(key, data);
	// 		}
	// 		var args = functions.index(index);
	// 		if (index < functions.length) {
	// 			index++;
	// 			args.value((data: T) => {
	// 				next(index, data, args.key);
	// 			});
	// 		} else {
	// 			done(allData);
	// 		}
	// 		return index;
	// 	};
	// 	next(0);
	// }

	export class Queue<K, T> extends HG.Core.EventDispatcher {

		index: number;
		entries: HG.Core.Hash<K, Function>;
		result: HG.Core.Hash<K, T>;

		constructor() {
			super(["done"]);
			this.index = 0;
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
			if (entry.value !== null && entry.value !== undefined) {
				entry.value((data: T) => {
					this.result.push(entry.key, data);
					this.next();
				});
			} else {
				this.dispatch("done", this.result);
			}
		}

		start(): HG.Core.Queue<K, T> {
			this.next();
			return this;
		}

	}

}