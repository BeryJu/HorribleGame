///<reference path="EventDispatcher" />

module HG {
	export var DefaultEntityParams = {
		extra: {},
		position: new THREE.Vector3(),
		rotation: new THREE.Vector3(),
		targetPosition: new THREE.Vector3(),
		object: new THREE.Object3D(),
	}

	export class Entity extends EventDispatcher{
		_: {};
		children: Entity[] = [];
		object: THREE.Object3D;

		constructor(params: any) {
			super();
			if (!params) return;
			if (params.extra !== {}) {
				for (var key in params.extra) {
					this.object[key] = params.extra[key];
				}
			}
			this.object = params.object;
			this.object.position = params.position;
			this.object.rotation = params.rotation;
		}

		// toJSON(): {} {
			
		// }

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