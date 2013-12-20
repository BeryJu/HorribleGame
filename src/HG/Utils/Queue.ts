/*
* @Author: BeryJu
* @Date:   2013-12-20 12:33:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 15:00:52
*/

module HG.Utils {

	export class Queue extends HG.Core.EventDispatcher {

		functions: Function[];
		index: number;
		data: {};

		constructor() {
			super(["done"]);
			this.functions = [];
			this.index = 0;
			this.data = {};
		}

		push(fn: Function): HG.Utils.Queue {
			this.functions.push(fn);
			return this;
		}

		next(data?: any): number {
			if (this.index !== 0) {
				this.data[this.index - 1] = data;
			}
			if (this.index < this.functions.length) {
				this.index++;
				this.functions[this.index]((data: any) => {
					this.next(data);
				});
			} else {
				this.dispatch("done", this.data);
			}
			return this.index;
		}

		doAll(): void {
			this.next(0);
		}

	}

}