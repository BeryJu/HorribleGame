/*
* @Author: BeryJu
* @Date:   2013-11-07 13:15:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 11:38:36
*/

module HG.LINQ {

	export function initialize(): void {
		var registerFunction = function (key: string, type: any, fn: (...args: any[]) => any) {
			type[key] = function () {
				var args = Array.prototype.slice.call(arguments);
				args.splice(0, 0, this);
				return fn.apply(this, args);
			};
		};
		for (var type in HG.LINQ) {
			if (type.toString() !== "initialize") {
				var provider = <HG.LINQ.IProvider> new HG.LINQ[type]();
				var prototype = provider._prototype;
				for (var method in provider) {
					if (method !== "_prototype") {
						registerFunction(method, prototype, provider[method]);
					}
				}
			}
		}
	}

}