/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 20:33:15
*/

module HG.LINQ {

	export class ArrayProvider implements HG.LINQ.IProvider {

		_prototype = Array.prototype;

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

	}

}