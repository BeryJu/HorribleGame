/*
* Map.hg.ts
* Author: BeryJu
*/

module HG {

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