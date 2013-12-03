/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 20:22:15
*/

module HG.LINQ {

	export class NumberProvider implements HG.LINQ.IProvider {

		_prototype = Number.prototype;

		toRadian(nmb: number): number {
			return nmb * (Math.PI / 180);
		}

		toDegrees(nmb: number): number {
			return nmb * (180 / Math.PI);
		}

	}

}