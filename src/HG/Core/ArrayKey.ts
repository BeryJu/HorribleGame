
module HG.Core {

	export class ArrayKey<T> {

		private values: T[];
		private keys: any[];

		constructor() {
			this.values = [];
			this.keys = [];
		}

		forEach(fn: (value: T, index: number, key: any) => any): void {
			this.keys.forEach((key, index) => {
				fn(this.values[index], index, key);
			});
		}

		push(item: T, key: any): void {
			this.values.push(item);
			this.keys.push(key);
		}

		concat(...args: Array<HG.Core.ArrayKey<T>>): HG.Core.ArrayKey<T> {
			args.forEach((other, index) => {
				other.forEach((value, index, key) => {
					if (this.values.indexOf(value) === -1 &&
						this.keys.indexOf(key) === -1) {
						this.push(value, key);
					}
				});
			});
			return this;
		}

		value(v: T): any {
			var index = this.values.indexOf(v);
			if (index !== -1) {
				return this.keys[index];
			} else {
				HG.locale.errors.valueNotExistend.f(v).error();
				return null;
			}
		}

		key(k: any): T {
			var index = this.keys.indexOf(k);
			if (index !== -1) {
				return this.values[index];
			} else {
				HG.locale.errors.keyNotExistend.f(k).error();
				return null;
			}
		}

	}

}