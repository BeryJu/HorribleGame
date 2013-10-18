module HG {
	export class Scene {

		scene: THREE.Scene = null;
		entities: {
			named: {};
			unnamed: HG.BaseEntity[];
		};

		constructor() {
			this.scene = new THREE.Scene();
			this.entities = {
				named: {},
				unnamed: []
			};
		}

		add(BaseEntity: HG.BaseEntity, nameTag?: string): void {
			this.scene.add(BaseEntity.object);
			if (nameTag) {
				this.entities.named[nameTag.toLowerCase()] = BaseEntity;
			} else {
				this.entities.unnamed.push(BaseEntity);
			}
		}

		forNamed(callback: (e: any) => any, type?: any): void {
			if (!type) type = HG.BaseEntity;
			for (var k in this.entities.named) {
				var ne = this.entities.named[k];
				if (ne instanceof type) callback(ne);
			}
		}

		getAllNamed(type: any = HG.BaseEntity): any[] {
			var es = [];
			for (var k in this.entities.named) {
				var ne = this.entities.named[k];
				if (ne instanceof type) es.push(ne);
			}
			return es;
		}

		getAllUnnamed(type: any = HG.BaseEntity): any[] {
			var es = [];
			for (var i = 0; i < this.entities.unnamed.length; i++) {
				var ue = this.entities.unnamed[i];
				if (ue instanceof type) es.push(ue);
			}
			return es;
		}

		getAll(type: any = HG.BaseEntity): any[] {
			var es = [];
			for (var k in this.entities.named) {
				var ne = this.entities.named[k];
				if (ne instanceof type) es.push(ne)
			}
			for (var i = 0; i < this.entities.unnamed.length; i++) {
				var ue = this.entities.unnamed[i];
				if (ue instanceof type) es.push(ue);
			}
			return es;
		}

		get(nameTag: string[], type: any = HG.BaseEntity): any[] {
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