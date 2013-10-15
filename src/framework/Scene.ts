module HG {
	export class Scene {

		scene: THREE.Scene = null;
		entities: {
			named: {};
			unnamed: HG.Entity[];
		};

		constructor() {
			this.scene = new THREE.Scene();
			this.entities = {
				named: {},
				unnamed: []
			};
		}

		add(Entity: HG.Entity, nameTag?: string): void {
			var c = Entity.collectChildren();
			for (var i = 0; i < c.length; ++i) {
				this.scene.add(c[i].object);
			}
			if (nameTag) {
				this.entities.named[nameTag.toLowerCase()] = Entity;
			} else {
				this.entities.unnamed.push(Entity);
			}
		}

		getIndex(index: number): THREE.Object3D {
			return this.scene.children[index];
		}

		getAllNamed(type: any = HG.Entity): any[] {
			var es = [];
			for (var k in this.entities.named) {
				var ne = this.entities.named[k];
				if (ne instanceof type) es.push(ne)
			}
			return es;
		}

		getAllUnnamed(type: any = HG.Entity): any[] {
			var es = [];
			for (var i = 0; i < this.entities.unnamed.length; i++) {
				var ue = this.entities.unnamed[i];
				if (ue instanceof type) es.push(ue);
			}
			return es;
		}

		getAll(type: any = HG.Entity): any[] {
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

		get(nameTag: string[], type: any = HG.Entity): any[] {
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