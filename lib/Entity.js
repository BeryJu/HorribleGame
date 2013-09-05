var Entity = {
	CreateEntity: function(params) {
		params = params || Entity.DefaultEntityParams;
		params.__proto__ = Entity.DefaultEntityParams;
		var finalObjects = [];
		params._Object.each(function(o) {
			if (params.Extra !== {}) {
				for (var key in params.Extra) {
					o[key] = params.Extra[key];
				}
			}
			if (o.material)
				o.wireframe = Settings.Debug;
			if (o.target)
				o.target.position = params.TargetPosition;
			o.position = params.Position;
			o.rotation = params.Rotation;
			finalObjects.push(o);
		});
		return {
			__proto__: Entity.IEntity,
			_Object: finalObjects,
			OnLoad: params.OnLoad,
			OnKeyDown: params.OnKeyDown,
			OnResize: params.OnResize,
			OnRender: params.OnRender
		};
	},
	IEntity: {
		_Object: undefined, //THREE.js Mesh
		OnLoad: function(self) {},
		OnKeyDown: function(e, self) {},
		OnResize: function(self) {},
		OnRender: function(self) {}
	},
	DefaultEntityParams: {
		Extra: {
			castShadow: true,
			receiveShadow: true
		},
		Position: new THREE.Vector3(0, 0, 0),
		Rotation: new THREE.Vector3(0, 0, 0),
		TargetPosition: new THREE.Vector3(0, 0, 0),
		_Object: new THREE.Mesh(
			new THREE.CubeGeometry(0, 0, 0),
			new THREE.MeshBasicMaterial({color: 0xffffff})),
		OnLoad: function(self) {},
		OnKeyDown: function(e, self) {},
		OnResize: function(self) {},
		OnRender: function(self) {}
	}
};
