/// <reference path="IProvider.hg.ts" />
/* 
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-12 22:15:54
*/
module HG {

	export module LINQ {

		export class StringProvider implements IProvider {

			f(context: string, ...args): string {
				return "";
			}

			replaceAll(context: string, find: string, replace: string): string {
				find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
				return context.replace(new RegExp(find, 'g'), replace);
			}

			registerFunction(key: string, fn: (...args) => any): void {
				String.prototype[key] = function() {
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