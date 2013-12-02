/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:47:55
*/

module HG.Scenes {

	export class BaseScene {

		scene: Physijs.Scene = null;
		controls: HG.Core.InputHandler;
		entities: {
			named: {};
			unnamed: HG.Entities.BaseEntity[];
		};

		constructor() {
			this.controls = new HG.Core.InputHandler();
			this.scene = new Physijs.Scene();
			this.entities = {
				named: {},
				unnamed: []
			};
		}

		add(entity: HG.Entities.BaseEntity, nameTag?: string): void {
			this.scene.add(entity.getInternal());
			if (nameTag) {
				this.entities.named[nameTag.toLowerCase()] = entity;
			} else {
				this.entities.unnamed.push(entity);
			}
		}

		getAllNamed(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			this.entities.named.each((k, v) => {
				if (v instanceof type) es.push(v);
			});
			return es;
		}

		getAllUnnamed(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			this.entities.unnamed.each((e) => {
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
			this.entities.named.each((k, v) => {
				if (v instanceof type) callback(v, k);
			});
		}

		forUnamed(callback: (e: any) => any, type?: any): void {
			if (!type) type = HG.Entities.BaseEntity;
			this.entities.unnamed.each((e) => {
				if (e instanceof type) callback(e);
			});
		}

		forAll(callback: (e: any) => any, type: any = HG.Entities.BaseEntity): void {
			this.forNamed(callback, type);
			this.forUnamed(callback, type);
		}

		getInternal(): Physijs.Scene {
			return this.scene;
		}

		get(nameTag: string[], type: any = HG.Entities.BaseEntity): any[] {
			var e = [];
			for (var i = 0; i < nameTag.length; i++) {
				var ee = this.entities.named[nameTag[i].toLowerCase()];
				if (ee instanceof type) e.push(ee);
			}
			return e;
		}

	}

}