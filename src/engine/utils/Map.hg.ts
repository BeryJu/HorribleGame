/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-06 15:08:08
*/

module HG {

	export module Utils {

		export class Map<T> {

			data: {} = {};

			set<T>(data: T, x: number = 0, y: number = 0, z: number = 0): boolean {
				if (!this.data[x]) this.data[x] = {};
				if (!this.data[x][y]) this.data[x][y] = {};
				var overwritten = false;
				if (this.data[x][y][z]) overwritten = true;
				this.data[x][y][z] = data;
				return overwritten;
			}

			get<T>(x: number = 0, y: number = 0, z: number = 0, fallback?: any): T {
				if (!this.data[x]) return fallback;
				if (!this.data[x][y]) return fallback;
				if (!this.data[x][y][z]) return fallback;
				return <T> this.data[x][y][z];
			}

			clearX(x: number): boolean {
				if (this.data[x]) this.data[x] = {};
				return true;
			}

			clearY(x: number, y: number): boolean {
				if (!this.data[x]) return false;
				if (this.data[x][y]) this.data[x][y] = {}
			}
			
			clearZ(x: number, y: number, z: number): boolean {
				if (!this.data[x]) return false;
				if (!this.data[x][y]) return false;
				if (this.data[x][y][z]) this.data[x][y][z] = {}
			}

		}
		
	}

}