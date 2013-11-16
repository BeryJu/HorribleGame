/// <reference path="IProvider.ts" />
/* 
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-16 14:19:02
*/
module HG {

	export module LINQ {

		export class NumberProvider implements IProvider {

			toRadian(nmb: number): number {
				return nmb * (Math.PI / 180);
			}

			toDegrees(nmb: number): number {
				return nmb * (180 / Math.PI);
			}

			registerFunction(key: string, fn: (...args: any[]) => any): void {
				Number.prototype[key] = function() {
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