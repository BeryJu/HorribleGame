/*
* @Author: BeryJu
* @Date:   2013-12-20 12:33:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 14:25:20
*/

module HG.Utils {

	export function queue<T>(functions: Function[], done: (allData: T[]) => void) {
		var allData: T[] = [];
		var next = (index: number, data?: any) => {
			if (index !== 0) {
				allData[index - 1] = data;
			}
			var func = functions[index];
			if (index < functions.length) {
				index++;
				func((data: any) => {
					next(index, data);
				});
			} else {
				done(allData);
			}
			return index;
		};
		next(0);
	}

}