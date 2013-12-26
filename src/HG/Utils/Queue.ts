/*
* @Author: BeryJu
* @Date:   2013-12-20 12:33:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 17:47:44
*/

module HG.Utils {

	export function queue<K, T>(functions: HG.Core.Hash<K, Function>,
				done: (data: HG.Core.Hash<K, T>) => void) {
		var allData = new HG.Core.Hash<K, T>();
		var next = (index: number, data?: T, key?: K) => {
			if (index !== 0) {
				allData.push(key, data);
			}
			var args = functions.index(index);
			if (index < functions.length) {
				index++;
				args.value((data: T) => {
					next(index, data, args.key);
				});
			} else {
				done(allData);
			}
			return index;
		};
		next(0);
	}

}