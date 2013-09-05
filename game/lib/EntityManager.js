var EntityManager = function(Entities) {
	this.Entities = Entities || [];
	this.Scene = new THREE.Scene();
	this.forEach = function(callback) {
		this.Entities.forEach(function(e) {
			callback(e);
		});
	};
	this.each = this.forEach;
	this.push = function(e) {
		if (e.__proto__ === Entity.IEntity) {
			this.Entities.push(e);
			this.Scene.add(e._Object);
		} else {
			this.Entities.push(Entity.CreateEntity({
				_Object: e
			}));
			this.Scene.add(e);
		}
	};
	this.GetScene = function() {
		return this.Scene;
	};
};