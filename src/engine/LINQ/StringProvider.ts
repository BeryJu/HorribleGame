/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 17:10:09
*/

module HG.LINQ {

	export class StringProvider implements HG.LINQ.IProvider {

		_prototype = String.prototype;

		format(context: string, arg1: any, ...args: any[]): string {
			if (args.length > 0 || typeof arg1 === "number" || typeof arg1 === "string") {
				context = context.replaceAll("${0}", arg1);
				args.forEach((arg, index) => {
					context = context.replaceAll("${" + (index + 1) + "}", arg);
				});
			} else {
				for (var k in arg1) {
					context = context.replaceAll("${" + k + "}", arg1[k]);
				}
			}
			return context;
		}

		f = this.format;

		log(context: string): void {
			HG.log(context);
		}

		warn(context: string): void {
			HG.warn(context);
		}

		error(context: string): void {
			throw new Error(context);
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

	}

}