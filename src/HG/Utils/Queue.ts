/*
* @Author: BeryJu
* @Date:   2013-12-20 12:33:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-20 14:20:29
*/

module HG.Utils {

	export function queue<T>(fns: Function[], done: (allData: T[]) => void) {
		var allData: T[] = [];
		var next = (index: number, data?: any) => {
			if (index !== 0) {
				allData[index - 1] = data;
			}
			var func = fns[index];
			index++;
			if ((index - 1) < fns.length) {
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