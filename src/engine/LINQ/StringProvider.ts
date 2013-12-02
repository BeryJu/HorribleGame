/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:03:05
*/

module HG.LINQ {

	export class StringProvider implements HG.LINQ.IProvider {

		format(context: string, ...args: any[]): string {
			args.each((arg, index) => {
				context = context.replaceAll("${" + index + "}", arg);
			});
			return context;
		}

		f = this.format;

		log(context: string): void {
			HG.log(context);
		}

		warn(context: string): void {
			HG.warn(context);
		}

		lengthen(context: string, length: number, filler?: string): string {
			filler = filler || " ";
			var diff = length - context.length;
			HG.log(diff);
			for (var i = 0; i < diff; i++) {
				context += filler;
			}
			return context;
		}

		replaceAll(context: string, find: RegExp, replace: string): string;
		replaceAll(context: string, find: string, replace: string): string;
		replaceAll(context: string, find: any, replace: string): string {
			if (typeof find === "string") {
				find = find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			} else {
				find = find.source;
			}
			return context.replace(new RegExp(find, "g"), replace);
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