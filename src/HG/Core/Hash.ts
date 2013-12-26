/*
* @Author: BeryJu
* @Date:   2013-12-26 13:18:30
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 19:07:40
*/

module HG.Core {

	export class Hash<K, T> {

		private keys: K[];
		private values: T[];

		constructor() {
			this.values = [];
			this.keys = [];
		}

		get length (): number {
			return this.values.length;
		}

		forEach(fn: (key: K, value: T, index: number) => any): void {
			this.keys.forEach((key, index) => {
				fn(key, this.values[index], index);
			});
		}

		push(key: K, value: T): void {
			if (this.indexOf(key) === -1) {
				this.values.push(value);
				this.keys.push(key);
			} else {
				this.set(key, value);
			}
		}

		toValueArray(): T[] {
			return this.values;
		}

		toKeyArray(): K[] {
			return this.keys;
		}

		toNativeHash(): {} {
			var base = {};
			this.forEach((k, v) => {
				base[k.toString()] = v;
			});
			return base;
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

		indexOf(key: K): number {
			return this.keys.indexOf(key);
		}

		concat(...args: Array<HG.Core.Hash<K, T>>): HG.Core.Hash<K, T> {
			args.forEach((other, index) => {
				other.forEach((key, value, index) => {
					if (this.values.indexOf(value) === -1 &&
						this.keys.indexOf(key) === -1) {
						this.push(key, value);
					}
				});
			});
			return this;
		}

		index(index: number): {
			key: K;
			value: T;
		} {
			return {
				key: this.keys[index],
				value: this.values[index]
			};
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