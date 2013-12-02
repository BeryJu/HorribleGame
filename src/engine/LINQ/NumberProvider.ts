/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 16:41:11
*/

module HG.LINQ {

	export class NumberProvider implements HG.LINQ.IProvider {

		toRadian(nmb: number): number {
			return nmb * (Math.PI / 180);
		}

		toDegrees(nmb: number): number {
			return nmb * (180 / Math.PI);
		}

		registerFunction(key: string, fn: (...args: any[]) => any): void {
			Number.prototype[key] = function () {
				var args = Array.prototype.slice.call(arguments);
				args.splice(0, 0, this);
				return fn.apply(this, args);
			};
		}

		provide(): void {
			for (var k in this) {
				if (k !== "provide") {
					this.registerFunction(k, this[k]);
				}
			}
		}
	}

}