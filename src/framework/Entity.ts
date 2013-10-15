///<reference path="GameComponent" />

module HG {

	export class Entity extends GameComponent{
		_: {};
		children: Entity[] = [];
		object: THREE.Object3D;

		constructor(object?: THREE.Object3D) {
			super();
			if (object) this.object = object;
		}

		position(x: number, y: number, z: number): void {
			if (this.object !== undefined) {
				this.object.position.set(x, y, z);
			}
		}

		rotation(x: number, y: number, z: number): void {
			if (this.object !== undefined) {
				this.object.rotation.set(x, y, z);
			}
		}

		set(key: string, value: any):HG.Entity {
			if (this.children.length > 0) {
				this.children.forEach(function(c) {
					c.set(key, value);
				});
			}
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

		hasChildren(): boolean {
			return (this.children.length > 0);
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

		collectChildren() {
			var result = [];
			result.push(this);
			if (this.children.length > 0) {
				this.children.forEach(function(c) {
					result.push(c)
				});
			}
			return result;
		}

		connect(e: Entity) {
			this.children.push(e);
			return this;
		}

		fromObject3D(o: THREE.Object3D): HG.Entity {
			this.object = o;
			return this;
		}
	}
}