/*
* @Author: BeryJu
* @Date:   2013-11-07 13:15:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-01 22:03:46
*/

module HG.LINQ {

	export function initialize(): void {

		for (var type in HG.LINQ) {
			if (type.toString() !== "initialize") {
				var provider = <HG.LINQ.IProvider> new HG.LINQ[type]();
				provider.provide();
			}
		}

	}

}