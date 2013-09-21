module HG {
	export class Scene {

		Scene: THREE.Scene = null;

		constructor() {
			this.Scene = new THREE.Scene();
		}

		add(Entity: HG.Entity):void {
			var c = Entity.CollectChildren();
			for (var i = 0; i < c.length; ++i) {
				this.Scene.add(c[i].Object);
			}
		}

	}
}