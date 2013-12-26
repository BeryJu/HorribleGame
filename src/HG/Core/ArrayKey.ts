/*
* @Author: BeryJu
* @Date:   2013-12-26 13:18:30
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 13:31:41
*/

module HG.Core {

	export class ArrayKey<K, T> {

		private values: T[];
		private keys: K[];

		constructor() {
			this.values = [];
			this.keys = [];
		}

		forEach(fn: (value: T, index: number, key: K) => any): void {
			this.keys.forEach((key, index) => {
				fn(this.values[index], index, key);
			});
		}

		push(key: K, value: T): void {
			this.values.push(value);
			this.keys.push(key);
		}

		set(key: K, value: T): boolean {
			var index = this.keys.indexOf(key);
			if (index !== -1) {
				this.values[index] = value;
				return true;
			} else {
				return false;
			}
		}

		has(key: K): boolean {
			return (this.keys.indexOf(key) !== -1) ? true : false;
		}

		concat(...args: Array<HG.Core.ArrayKey<K, T>>): HG.Core.ArrayKey<K, T> {
			args.forEach((other, index) => {
				other.forEach((value, index, key) => {
					if (this.values.indexOf(value) === -1 &&
						this.keys.indexOf(key) === -1) {
						this.push(key, value);
					}
				});
			});
			return this;
		}

		value(v: T): K {
			var index = this.values.indexOf(v);
			if (index !== -1) {
				return this.keys[index];
			} else {
				HG.locale.errors.valueNotExistend.f(v).error();
				return null;
			}
		}

		key(k: K): T {
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