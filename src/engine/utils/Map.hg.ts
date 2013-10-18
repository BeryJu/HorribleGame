module HG {

	export class Map {

		data: {} = {};

		set(data: any, x: number = 0, y: number = 0, z: number = 0): boolean {
			if (!this.data[x]) this.data[x] = {};
			if (!this.data[x][y]) this.data[x][y] = {};
			if (!this.data[x][y][z]) this.data[x][y][z] = {};
			var overwritten = false;
			if (this.data[x][y][z]) overwritten = true;
			this.data[x][y][z] = data;
			return overwritten;
		}

		get(x: number = 0, y: number = 0, z: number = 0, fallback: any = undefined): any {
			if (!this.data[x]) return fallback;
			if (!this.data[x][y]) return fallback;
			if (!this.data[x][y][z]) return fallback;
			return this.data[x][y][z];
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