/* 
* @Author: BeryJu
* @Date:   2013-11-07 13:15:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 13:36:53
*/
module HG {

	export module LINQ {

		export function initialize(): void {

			for (var m in HG.LINQ) {
				if (m.toString() !== "initialize") {
					var provider = <HG.LINQ.IProvider> new HG.LINQ[m]();
					provider.provide();
					HG.log("[LINQ] Provided "+m);
				}
			}

		}

	}

}