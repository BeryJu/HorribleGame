module HG {
	export class Scene {

		scene: THREE.Scene = null;

		constructor() {
			this.scene = new THREE.Scene();
		}

		add(Entity: HG.Entity): void {
			var c = Entity.collectChildren();
			for (var i = 0; i < c.length; ++i) {
				this.scene.add(c[i].object);
			}
		}

		get(index: number): THREE.Object3D {
			return this.scene.children[index];
		}

	}
}