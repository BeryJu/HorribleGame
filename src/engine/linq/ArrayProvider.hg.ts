/// <reference path="IProvider.hg.ts" />
/* 
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-12 22:08:59
*/
module HG {

	export module LINQ {

		export class ArrayProvider implements IProvider {

			each(context: any[], fn: (e: any) => any): void {
				context.forEach(fn);
			}

			where(context: any[], query: (e: any) => boolean): any[] {
				var result = [];
				context.forEach((e) => {
					if (query(e) === true) result.push(e);
				});
				return result;
			}

			order(context: any[], order: (a: any, b: any) => any): any[] {
				return context.sort(order);
			}

			select(context: any[], selector: (e: any) => any): any[] {
				var result = [];
				context.forEach((e) => {
					result.push(selector(e));
				});
				return result;
			}

			registerFunction(key: string, fn: (...args) => any): void {
				Array.prototype[key] = function() {
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

}