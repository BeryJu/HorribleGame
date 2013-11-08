/// <reference path="IProvider.hg.ts" />
/* 
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-08 17:06:12
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
				console.log(result);
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

			provide(): void {
				var scope = this;
				for (var k in this) {
					if (k !== "provide") {
						var fn = scope[k];
						Array.prototype[k] = function() {
							var args = Array.prototype.slice.call(arguments);
							args.splice(0, 0, this);
							return fn.apply(this, args);
						}
					}
				}
			}

		}

	}

}