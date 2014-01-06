/*
* @Author: BeryJu
* @Date:   2013-12-22 12:16:02
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-05 22:27:12
*/

module HG.Core {

	export class Collection<T extends { name?: string }> {

		named: HG.Core.Hash<string, T> = new HG.Core.Hash<string, T>();
		unNamed: T[] = [];

		push(item: T, name?: string): void {
			if (item.name || name) {
				var n = (item.name || name).toLowerCase();
				if (this.named[n]) {
					HG.locale.errors.duplicateNameTagError.f(item.name).throw();
				} else {
					this.named.push(n, item);
				}
			} else {
				this.unNamed.push(item);
			}
		}

		concat(otherCollection: HG.Core.Collection<T>): HG.Core.Collection<T> {
			var newCollection = new HG.Core.Collection<T>();
			newCollection.unNamed = this.unNamed.concat(otherCollection.unNamed);
			for (var k in this.named) {
				newCollection.named[k] = this.named[k];
			}
			for (var k in otherCollection.named) {
				newCollection.named[k] = otherCollection.named[k];
			}
			return newCollection;
		}

		has(name: string): boolean {
			if (!name) return false;
			return (this.named.has(name.toLowerCase())) ? true : false;
		}

		getAllNamed(): T[] {
			return this.named.toValueArray();
		}

		getAllUnnamed(): T[] {
			return this.unNamed;
		}

		getAll(): T[] {
			return <T[]> this.getAllUnnamed().concat(this.getAllNamed());
		}

		forNamed(callback: (v: T, k?: any, i?: any) => any): void {
			this.named.forEach(callback);
		}

		forUnamed(callback: (v: T, k?: any, i?: any) => any): void {
			this.unNamed.forEach(callback);
		}

		forEach(callback: (v: T, k?: any, i?: any) => any): void {
			this.unNamed.forEach(callback);
			this.named.forEach(callback);
		}

		get(name: string): T {
			name = name.toLowerCase();
			return <T> this.named.key(name) || null;
		}

		forAll(callback: (e: any) => any): void {
			this.forNamed(callback);
			this.forUnamed(callback);
		}

	}

}