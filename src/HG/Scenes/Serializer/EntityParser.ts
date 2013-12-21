/*
* @Author: BeryJu
* @Date:   2013-12-07 23:42:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 10:19:21
*/

module HG.Scenes.Serializer {

	export class EntityParser extends HG.Core.EventDispatcher {

		scene: HG.Scenes.BaseScene;
		loader: HG.Resource.ResourceLoader;
		defaultPosition: number[] = [0, 0, 0];
		defaultRotation: number[] = [0, 0, 0];
		defaultOffset: number[] = [0, 0, 0];
		defaultScale: number[] = [1, 1, 1];

		constructor(scene: HG.Scenes.BaseScene,
				loader: HG.Resource.ResourceLoader) {
			super(["parsed", "entitiesParsed", "done"]);
			this.scene = scene;
			this.loader = loader;
		}

		private parseMaterials(raw: any, scene: HG.Scenes.BaseScene): any {
			if (Array.isArray(raw) === true) {
				var materials = [];
				raw.forEach((m) => {
					materials.push(this.parseSingleMaterial(m, scene));
				});
				return new THREE.MeshFaceMaterial(materials);
			} else {
				return this.parseSingleMaterial(raw, scene);
			}
		}

		private parseGeometry(raw: HG.Scenes.Serializer.ObjectDefinition,
				scene: HG.Scenes.BaseScene): THREE.Geometry {
			var geometryType = THREE[raw.type];
			var geometryProperties = this.parseProperties(raw.properties, scene);
			var geometry = this.applyConstructor(geometryType, geometryProperties);
			return <THREE.Geometry> geometry;
		}

		private parseSingleMaterial(raw: HG.Scenes.Serializer.MaterialDefinition,
				scene: HG.Scenes.BaseScene): any {
			var material;
			var materialType;
			if (raw.properties[0]["color"]) {
				raw.properties[0]["color"] = HG.Utils.parseColor(raw.properties[0]["color"]);
			}
			var properties = this.parseProperties(raw.properties, scene);
			if (!raw.texture) {
				materialType = THREE[raw.type];
				material = new materialType(properties);
			} else {
				var map = THREE.ImageUtils.loadTexture(this.loader.path(raw.texture));
				materialType = THREE[raw.type];
				properties["map"] = map;
				material = new materialType(properties);
			}
			return material;
		}

		private parseShader(raw: HG.Scenes.Serializer.ShaderDefinition,
				scene: HG.Scenes.BaseScene): any {
			var rawShader = this.loader.json<HG.Scenes.Serializer.RawShaderDefinition>(raw.type);
			var shader = new HG.Core.Shader(rawShader, this.loader);
			shader.parseUniforms(raw.properties);
			return shader.toMaterial();
		}

		private parseAbilities(raw: HG.Scenes.Serializer.EntityDefinition,
				entity: HG.Entities.Entity,
				scene: HG.Scenes.BaseScene): void {
			if (raw.abilities) {
				raw.abilities.forEach((rawAbility) => {
					// get the ability type
					var type = HG.Abilities[rawAbility.type];
					// parse the properties
					var properties = this.parseProperties(rawAbility.properties, scene);
					var keyboardBindings = rawAbility.bindings.keyboard || [];
					var mouseBindings = rawAbility.bindings.mouse || [];
					// get an instance of the the ability
					var ability = this.applyConstructor(type, properties);
					// apply all keyboard bindings
					keyboardBindings.forEach((binding) => {
						var keyHandler = ability[binding.action];
						scene.controls.keyboard.bind(HG.settings.keys[binding.event],
							(delta: number, event: string) => {
							keyHandler.apply(ability, [delta, event]);
						});
					});
					// apply all mouse bindings
					mouseBindings.forEach((binding) => {
						var keyHandler = ability[binding.action];
						scene.controls.mouse.bind(binding.event,
							(delta: number, event: string) => {
							keyHandler.apply(ability, [delta, event]);
						});
					});
					entity.ability(ability);
				});
			}
		}

		private setup(raw: HG.Scenes.Serializer.EntityDefinition,
				entity: HG.Entities.Entity): HG.Entities.Entity {
			var offset = (raw.offset) ? this.parseArray(raw.offset, 3) : this.defaultOffset;
			var scale = (raw.scale) ? this.parseArray(raw.scale, 3) : this.defaultScale;
			var rotation = (raw.rotation) ? this.parseArray(raw.rotation, 3) : this.defaultRotation;
			var position = (raw.position) ? this.parseArray(raw.position, 3) : this.defaultPosition;
			// use this so we don't have to access every single number
			entity.offset.apply(entity, offset);
			entity.scale.apply(entity, scale);
			entity.rotate.apply(entity, rotation);
			entity.position.apply(entity, position);
			return entity;
		}

		private parseArray(raw: any, length: number = 3): any[] {
			if (Array.isArray(raw) === true) {
				if (raw.length < length) {
					for (var i = raw.length; i < length; i ++) {
						raw.push(raw[0]);
					}
					return raw;
				} else {
					return raw;
				}
			} else if (typeof raw === "number") {
				var nmbs = [];
				for (var d = 0; d < length; d ++) {
					nmbs.push(raw);
				}
				return nmbs;
			}
		}

		private applyConstructor(type: any, argArray: any[]): any {
			var args = [null].concat(argArray);
			var instance = type.bind.apply(type, args);
			return new instance();
		}

		private parseProperties(raw: any, scene: HG.Scenes.BaseScene): any {
			var props = [];
			raw.forEach((prop) => {
				props.push(this.parseProperty(prop, scene));
			});
			return props;
		}

		private parseProperty(raw: any, scene: HG.Scenes.BaseScene): any {
			if (typeof raw === "string") {
				if (raw.substring(0, 8) === "${scene:") {
					var entity = scene.entities.get(raw.replace("${scene:", "").replace("}", ""));
					return entity;
				} else {
					return raw.f({
						ratio: window.innerWidth / window.innerHeight,
						viewDistance: HG.settings.graphics.viewDistance,
						fov: HG.settings.graphics.fov
					});
				}
			} else {
				return raw;
			}
		}

		parse(rawEntity: HG.Scenes.Serializer.EntityDefinition): void {
			var type = HG.Entities[rawEntity.type];
			var entity;

			// Entity should have a Model
			// i.e. models/android.js
			if (rawEntity.model) {
				entity = new type();
				if (rawEntity.name) entity.name = rawEntity.name;

				entity.on("loaded", (geometry, material) => {
					this.setup(rawEntity, entity);
					this.parseAbilities(rawEntity, entity, this.scene);
					this.dispatch("parsed", entity);
				});
				this.loader.model(rawEntity.model, entity);
			} else if (rawEntity.model && rawEntity.material) {
				entity = new type();
				if (rawEntity.name) entity.name = rawEntity.name;
				var material = this.parseMaterials(rawEntity.material, this.scene);
				entity.on("loaded", (geometry, material) => {
					this.setup(rawEntity, entity);
					this.parseAbilities(rawEntity, entity, this.scene);
					this.dispatch("parsed", entity);
				});
				this.loader.model(rawEntity.model, entity, material);
			// Entity should have material and geometry
			// i.e. MeshPhongMaterial and CubeGeometry
			} else if (rawEntity.material && rawEntity.geometry) {
				entity = new type();
				if (rawEntity.name) entity.name = rawEntity.name;

				var material = this.parseMaterials(rawEntity.material, this.scene);
				var geometry = this.parseGeometry(rawEntity.geometry, this.scene);
				var mesh = new THREE.Mesh(geometry, material);
				entity.object = mesh;
				this.setup(rawEntity, entity);
				this.dispatch("parsed", entity);
			// Entity should have shader and geometry
			// i.e. FireballShader and CubeGeometry
			} else if (rawEntity.shader && rawEntity.geometry) {
				entity = new type();
				if (rawEntity.name) entity.name = rawEntity.name;

				var geometry = this.parseGeometry(rawEntity.geometry, this.scene);
				var material = this.parseShader(rawEntity.shader, this.scene);
				var mesh = new THREE.Mesh(geometry, material);
				entity.object = mesh;
				this.setup(rawEntity, entity);
				this.dispatch("parsed", entity);
			// Entity has object
			// i.e. PointLight
			} else if (rawEntity.object) {
				entity = new type();
				if (rawEntity.name) entity.name = rawEntity.name;

				var objectType = THREE[rawEntity.object.type];
				var objectProperties = rawEntity.object.properties;
				var object = this.applyConstructor(objectType, objectProperties);
				entity.object = object;
				this.setup(rawEntity, entity);
				this.dispatch("parsed", entity);
			// Directly call an constructor
			// i.e. ChasingCameraEntity
			} else if (rawEntity.type && rawEntity.properties) {
				var properties = this.parseProperties(rawEntity.properties, this.scene);
				entity = this.applyConstructor(type, properties);

				if (rawEntity.name) entity.name = rawEntity.name;
				this.dispatch("parsed", entity);
			}
		}

	}

}