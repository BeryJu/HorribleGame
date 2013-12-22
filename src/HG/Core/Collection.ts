/*
* @Author: BeryJu
* @Date:   2013-12-22 12:16:02
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 12:40:40
*/

module HG.Core {

	export class Collection<T extends { name?: string }> {

		named: {} = {};
		unNamed: T[] = [];

		add(item: T, name?: string): void {
			if (item.name || name) {
				var n = (item.name || name).toLowerCase();
				if (this.named[n]) {
					HG.locale.errors.duplicateNameTagError.f(item.name).error();
				} else {
					this.named[n] = item;
				}
			} else {
				this.unNamed.push(item);
			}
		}

		merge(otherCollection: HG.Core.Collection<T>): HG.Core.Collection<T> {
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
			return (this.named[name.toLowerCase()]) ? true : false;
		}

		getAllNamed(): T[] {
			var es: T[] = [];
			for (var k in this.named) {
				var v = this.named[k];
				es.push(v);
			}
			return es;
		}

		getAllUnnamed(): T[] {
			return this.unNamed;
		}

		getAll(): T[] {
			return <T[]> this.getAllUnnamed().concat(this.getAllNamed());
		}

		forNamed(callback: (e: any, k: string) => any): void {
			for (var k in this.named) {
				var ne = this.named[k];
				callback(ne, k);
			}
		}

		forUnamed(callback: (e: any) => any): void {
			this.unNamed.forEach(callback);
		}

		forEach(callback: (e: any, i: any, ...args: any[]) => any): void {
			this.unNamed.forEach(callback);
			for (var k in this.named) {
				callback(this.named[k], k);
			}
		}

		get(name: string): T {
			name = name.toLowerCase();
			return <T> this.named[name] || null;
		}

		forAll(callback: (e: any) => any): void {
			this.forNamed(callback);
			this.forUnamed(callback);
		}

	}

}