///<reference path="EventDispatcher" />

module HG {
	export var DefaultEntityParams = {
		Extra: {},
		Position: new THREE.Vector3(),
		Rotation: new THREE.Vector3(),
		TargetPosition: new THREE.Vector3(),
		Object: new THREE.Object3D(),
		OnLoad(self):void {},
		OnKeyDown(e, self):void {},
		OnResize(self):void {},
		OnRender(self):void {}
	}

	export class Entity extends EventDispatcher{
		_: {};
		Children: Entity[] = [];
		Object: THREE.Object3D;

		constructor(params: any) {
			super();
			if (params.Extra !== {}) {
				for (var key in params.Extra) {
					this.Object[key] = params.Extra[key];
				}
			}
			this.Object = params.Object;
			this.Object.position = params.Position;
			this.Object.rotation = params.Rotation;
		}

		Set(key: string, value: any):HG.Entity {
			if (this.Children.length > 0) {
				this.Children.forEach(function(c) {
					c.Set(key, value);
				});
			}
			if (key.indexOf(".") === -1) {
				this.Object[key] = value;
			} else {
				var parts = key.split(".");
				var obj = this.Object;
				for (var i = 0; i < parts.length - 1; i++) {
					obj = obj[parts[i]];
				}
				obj[parts[length]] = value;
			}
			return this;
		}

		Get(key: string) {
			if (key.indexOf(".") === -1) {
				return this.Object[key];
			} else {
				var parts = key.split(".");
				var obj = this.Object;
				for (var i = 0; i < parts.length - 1; i++) {
					obj = obj[parts[i]];
				}
				return obj[parts[length]];
			}
		}

		CollectChildren() {
			var result = [];
			result.push(this);
			if (this.Children.length > 0) {
				this.Children.forEach(function(c) {
					result.push(c)
				});
			}
			return result;
		}

		Connect(e: Entity) {
			this.Children.push(e);
			return this;
		}
	}
}