var Entity = {
	CreateEntity: function(params) {
		params = params || Entity.DefaultEntityParams;
		params.__proto__ = Entity.DefaultEntityParams;
		var _Object = params._Object;
		if (params.Extra !== {}) {
			for (var key in params.Extra) {
				_Object[key] = params.Extra[key];
			}
		}
		if (_Object.material)
			_Object.wireframe = Settings.Debug;
		_Object.position = params.Position;
		_Object.rotation = params.Rotation;
		if (_Object.target)
			_Object.target.position = params.TargetPosition;
		return {
			__proto__: Entity.IEntity,
			_Object: _Object,
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
