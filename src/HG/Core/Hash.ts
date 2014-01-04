/*
* @Author: BeryJu
* @Date:   2013-12-26 13:18:30
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-03 21:36:58
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

		forEach(fn: (value: T, key: K, index: number) => any): HG.Core.Hash<K, T> {
			this.keys.forEach((key, index) => {
				fn(this.values[index], key, index);
			});
			return this;
		}

		push(key: K, value: T): HG.Core.Hash<K, T> {
			if (this.indexOf(key) === -1) {
				this.values.push(value);
				this.keys.push(key);
			} else {
				this.set(key, value);
			}
			return this;
		}

		toValueArray(): T[] {
			return this.values;
		}

		toKeyArray(): K[] {
			return this.keys;
		}

		static fromNative<NK, NT>(native: {}): HG.Core.Hash<NK, NT> {
			var hash = new HG.Core.Hash<NK, NT>();
			for (var prop in native) {
				hash.push(<NK> prop, <NT> native[prop]);
			}
			return hash;
		}

		shift(): {
			key: K;
			value: T;
		} {
			var k = this.keys.shift();
			var v = this.values.shift();
			return {
				key: k,
				value: v
			};
		}

		toNativeHash(): {} {
			var base = {};
			this.forEach((v: T, k: K, i: number) => {
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

		has(key: K): boolean {
			return (this.keys.indexOf(key) === -1) ? false : true;
		}

		concat(...args: Array<HG.Core.Hash<K, T>>): HG.Core.Hash<K, T> {
			args.forEach((other, index) => {
				other.forEach((value: T, key: K, index: number) => {
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