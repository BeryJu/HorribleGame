///<reference path="GameComponent" />

module HG {

	export class BaseEntity extends GameComponent {
		_: {};
		object: THREE.Object3D;
		positionOffset: THREE.Vector3 = new THREE.Vector3;
		rootEntity: HG.BaseEntity;

		constructor(object?: THREE.Object3D) {
			super();
			if (object) {
				this.object = object;
			} else {
				this.object = new THREE.Mesh();
			}
		}

		root(r: HG.BaseEntity): HG.BaseEntity {
			this.rootEntity = r;
			return this;
		}

		hasRoot(): boolean {
			return (this.rootEntity) ? true : false;
		}

		offset(x: number, y: number, z: number): HG.BaseEntity {
			if (this.rootEntity) this.rootEntity.offset(x, y, z);
			this.positionOffset.set(x, y, z);
			return this;
		}

		position(x: number, y: number, z: number): HG.BaseEntity {
			if (this.rootEntity) this.rootEntity.position(x, y, z);
			x = x + this.positionOffset.x;
			y = y + this.positionOffset.y;
			z = z + this.positionOffset.z;
			this.object.position.set(x, y, z);
			return this;
		}

		rotation(x: number, y: number, z: number): HG.BaseEntity {
			if (this.rootEntity) this.rootEntity.rotation(x, y, z);
			this.object.rotation.set(x, y, z);
			return this;
		}

		frame(delta: number): void {
			if (this.rootEntity) this.rootEntity.frame(delta);
		}

	}
}