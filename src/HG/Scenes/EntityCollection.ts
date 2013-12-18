/*
* @Author: BeryJu
* @Date:   2013-12-09 14:52:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-18 21:15:16
*/

module HG.Scenes {

	export class EntityCollection<T extends HG.Entities.BaseEntity> {

		named: {} = {};
		unNamed: T[] = [];

		add(entity: T): void {
			if (entity.name) {
				if (this.named[entity.name.toLowerCase()]) {
					HG.locale.errors.duplicateNameTagError.f(entity.name).error();
				} else {
					this.named[entity.name.toLowerCase()] = entity;
				}
			} else {
				this.unNamed.push(entity);
			}
		}

		merge(otherCollection: HG.Scenes.EntityCollection<T>): HG.Scenes.EntityCollection<T> {
			var newCollection = new HG.Scenes.EntityCollection<T>();
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

		getAllNamed(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			for (var k in this.named) {
				var v = this.named[k];
				if (v instanceof type) es.push(v);
			}
			return es;
		}

		getAllUnnamed(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			this.unNamed.forEach((e) => {
				if (e instanceof type) es.push(e);
			});
			return es;
		}

		getAll(type: any = HG.Entities.BaseEntity): any[] {
			return this.getAllUnnamed(type).concat(this.getAllNamed(type));
		}

		forNamed(callback: (e: any, k: string) => any, type?: any): void {
			if (!type) type = HG.Entities.BaseEntity;
			for (var k in this.named) {
				var ne = this.named[k];
				if (ne instanceof type) callback(ne, k);
			}
		}

		forUnamed(callback: (e: any) => any, type?: any): void {
			if (!type) type = HG.Entities.BaseEntity;
			this.unNamed.forEach((e) => {
				if (e instanceof type) callback(e);
			});
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

		forAll(callback: (e: any) => any, type: any = HG.Entities.BaseEntity): void {
			this.forNamed(callback, type);
			this.forUnamed(callback, type);
		}

	}

}