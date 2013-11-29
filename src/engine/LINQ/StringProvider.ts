/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:52:15
*/

module HG.LINQ {

	export class StringProvider implements HG.LINQ.IProvider {

		f(context: string, ...args: any[]): string {
			return "";
		}

		replaceAll(context: string, find: string, replace: string): string {
			find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			return context.replace(new RegExp(find, 'g'), replace);
		}

		registerFunction(key: string, fn: (...args: any[]) => any): void {
			String.prototype[key] = function () {
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