///<reference path="GameComponent" />

module HG {

	export class BaseEntity extends GameComponent {
		_: {};
		object: THREE.Object3D;
		positionOffset: THREE.Vector3 = new THREE.Vector3;

		constructor(object?: THREE.Object3D) {
			super();
			if (object) {
				this.object = object;
			} else {
				this.object = new THREE.Mesh();
			}
		}

		offset(x: number, y: number, z: number): HG.BaseEntity {
			this.positionOffset.set(x, y, z);
			return this;
		}

		position(x: number, y: number, z: number): HG.BaseEntity {
			x = x + this.positionOffset.x;
			y = y + this.positionOffset.y;
			z = z + this.positionOffset.z;
			this.object.position.set(x, y, z);
			return this;
		}

		rotation(x: number, y: number, z: number): HG.BaseEntity {
			this.object.rotation.set(x, y, z);
			return this;
		}

		set(key: string, value: any):HG.BaseEntity {
			if (key.indexOf(".") === -1) {
				this.object[key] = value;
			} else {
				var parts = key.split(".");
				var obj = this.object;
				for (var i = 0; i < parts.length - 1; i++) {
					obj = obj[parts[i]];
				}
				obj[parts[length]] = value;
			}
			return this;
		}

		get(key: string) {
			if (key.indexOf(".") === -1) {
				return this.object[key];
			} else {
				var parts = key.split(".");
				var obj = this.object;
				for (var i = 0; i < parts.length - 1; i++) {
					obj = obj[parts[i]];
				}
				return obj[parts[length]];
			}
		}

	}
}