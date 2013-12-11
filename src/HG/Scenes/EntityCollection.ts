/*
* @Author: BeryJu
* @Date:   2013-12-09 14:52:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-09 18:57:47
*/

module HG.Scenes {

	export class EntityCollection<T extends HG.Entities.BaseEntity> {

		named: {} = {};
		unNamed: T[] = [];

		add(entity: T): void {
			if (entity.name) {
				if (this.named[entity.name.toLowerCase()]) {
					HG.locale.core.errors.duplicateNameTagError.f(entity.name).error();
				} else {
					this.named[entity.name.toLowerCase()] = entity;
				}
			} else {
				this.unNamed.push(entity);
			}
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
			var es = [];
			es.concat(this.getAllUnnamed(type));
			es.concat(this.getAllNamed(type));
			return es;
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