/// <reference path="IProvider.hg.ts" />
/* 
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-08 17:06:08
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

			provide(): void {
				var scope = this;
				String.prototype['replaceAll'] = function (find, replace) {
					return scope.replaceAll(this, find, replace);
				};
				// for (var k in this) {
				// 	if (k !== "provide") {
				// 		var fn = scope[k];
				// 		String.prototype[k] = function() {
				// 			var args = Array.prototype.slice.call(arguments);
				// 			args.splice(0, 0, this);
				// 			return fn.apply(this, args);
				// 		}
				// 	}
				// }
			}

		}

	}

}