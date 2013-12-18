/*
* @Author: BeryJu
* @Date:   2013-12-16 14:28:25
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-16 14:33:04
*/

module HG.Utils {

	export class Tween {

		timeArray: any[] = [];
		valueArray: any[] = [];

		constructor(timeArray?: any[], valueArray?: any[]) {
			if (timeArray) this.timeArray = timeArray;
			if (valueArray) this.valueArray = valueArray;
		}

		lerp(t: number): any {
			var i = 0;
			var n = this.timeArray.length;
			while (i < n && t > this.timeArray[i])
				i++;
			if (i === 0) return this.valueArray[0];
			if (i === n) return this.valueArray[n - 1];
			var p = (t - this.timeArray[i - 1]) / (this.timeArray[i] - this.timeArray[i - 1]);
			if (this.valueArray[0] instanceof THREE.Vector3)
				return this.valueArray[i - 1].clone().lerp(this.valueArray[i], p);
			else // its a float
				return this.valueArray[i - 1] + p * (this.valueArray[i] - this.valueArray[i - 1]);
		}

	}

}