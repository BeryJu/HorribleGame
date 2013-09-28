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