/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 17:38:13
*/

module HG.LINQ {

	export class ObjectProvider implements HG.LINQ.IProvider {

		each(context: Object, fn: (k: string, v: any) => any): void {
			for (var k in context) {
				fn(k, context[k]);
			}
		}

		registerFunction(key: string, fn: (...args: any[]) => any): void {
			Object.prototype[key] = function () {
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