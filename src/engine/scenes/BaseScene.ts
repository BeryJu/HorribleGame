/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-11 13:58:05
*/

module HG {

	export module Scenes {

		export class BaseScene {

			scene: Physijs.Scene = null;
			controls: HG.InputHandler;
			entities: {
				named: {};
				unnamed: BaseEntity[];
			};

			constructor() {
				this.controls = new HG.InputHandler();
				this.scene = new Physijs.Scene();
				this.entities = {
					named: {},
					unnamed: []
				};
			}

			add(BaseEntity: BaseEntity, nameTag?: string): void {
				this.scene.add(BaseEntity.getInternal());
				if (nameTag) {
					this.entities.named[nameTag.toLowerCase()] = BaseEntity;
				} else {
					this.entities.unnamed.push(BaseEntity);
				}
			}

			getAllNamed(type: any = BaseEntity): any[] {
				var es = [];
				for (var k in this.entities.named) {
					var ne = this.entities.named[k];
					if (ne instanceof type) es.push(ne);;
				}
				return es;
			}

			getAllUnnamed(type: any = BaseEntity): any[] {
				var es = [];
				this.entities.unnamed.forEach((e) => {
					if (e instanceof type) es.push(e);
				});
				return es;
			}

			getAll(type: any = BaseEntity): any[] {
				var es = [];
				es.concat(this.getAllUnnamed(type));
				es.concat(this.getAllNamed(type));
				return es;
			}

			forNamed(callback: (e: any, k: string) => any, type?: any): void {
				if (!type) type = BaseEntity;
				for (var k in this.entities.named) {
					var ne = this.entities.named[k];
					if (ne instanceof type) callback(ne, k);
				}
			}

			forUnamed(callback: (e: any) => any, type?: any): void {
				if (!type) type = BaseEntity;
				this.entities.unnamed.forEach((e) => {
					if (e instanceof type) callback(e);
				});
			}

			forAll(callback: (e: any) => any, type: any = BaseEntity): void {
				this.forNamed(callback, type);
				this.forUnamed(callback, type);
			}

			getInternal(): Physijs.Scene {
				return this.scene;
			}

			get(nameTag: string[], type: any = BaseEntity): any[] {
				var e = [];
				for (var i = 0; i < nameTag.length; i++) {
					var ee = this.entities.named[nameTag[i].toLowerCase()];
					if (ee instanceof type) {
						e.push(ee);
					}
				}
				return e;
			}

		}
		
	}

}