/*
* @Author: BeryJu
* @Date:   2013-12-07 23:42:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-08 14:06:15
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
			var material;
			if (Array.isArray(raw) === true) {
				var materials = [];
				raw.forEach((m) => {
					materials.push(this.parseSingleMaterial(m, scene));
				});
				material = new THREE.MeshFaceMaterial(materials);
			} else {
				material = this.parseSingleMaterial(raw, scene);
			}
			return material;
		}

		private parseGeometry(raw: HG.Scenes.Serializer.ObjectDefinition,
				scene: HG.Scenes.BaseScene): THREE.Geometry {
			var geometryType = THREE[raw.type];
			var geometryProperties = this.parseProperties(raw.properties, scene);
			var geometry = this.applyConstructor(geometryType, raw.properties);
			return <THREE.Geometry> geometry;
		}

		parseColor(raw: any): THREE.Color {
			var color = new THREE.Color(0xaabbcc);
			if (Array.isArray(raw) === true) {
				color.setRGB.apply(color, raw);
			} else {
				color.setHex(raw);
			}
			return color;
		}

		private parseSingleMaterial(raw: HG.Scenes.Serializer.MaterialDefinition,
				scene: HG.Scenes.BaseScene): any {
			var material;
			var materialType;
			if (raw.properties[0]["color"]) {
				raw.properties[0]["color"] = this.parseColor(raw.properties[0]["color"]);
			}
			var properties = this.parseProperties(raw.properties, scene);
			if (!raw.texture) {
				materialType = THREE[raw.type];
				material = new materialType(properties);
			} else {
				var map = THREE.ImageUtils.loadTexture(this.loader.resolvePath(raw.texture));
				materialType = THREE[raw.type];
				properties["map"] = map;
				material = new materialType(properties);
			}
			return material;
		}

		private parseAbilities(raw: HG.Scenes.Serializer.EntityDefinition,
				entity: HG.Entities.BaseEntity,
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
				entity: HG.Entities.BaseEntity): HG.Entities.BaseEntity {
			var position = this.defaultPosition || raw.position;
			var rotation = this.defaultRotation || raw.rotation;
			var offset = this.defaultOffset || raw.offset;
			var scale = this.defaultScale || raw.scale;
			// use this so we don't have to access every single number
			entity.object.position.set.apply(entity.object.position, position);
			entity.object.rotation.set.apply(entity.object.rotation, rotation);
			entity.object.scale.set.apply(entity.object.scale, scale);
			entity.offset.apply(entity, offset);
			return entity;
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
					var entity = scene.get(raw.replace("${scene:", "").replace("}", ""));
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
				entity.on("loaded", (geometry, material) => {
					this.setup(rawEntity, entity);
					this.parseAbilities(rawEntity, entity, this.scene);
					this.dispatch("parsed", entity);
				});
				this.loader.model(rawEntity.model, entity);
			// Entity should have material and geometry
			// i.e. MeshPhongMaterial and CubeGeometry
			} else if (rawEntity.material && rawEntity.geometry) {
				entity = new type();
				var material = this.parseMaterials(rawEntity.material, this.scene);
				var geometry = this.parseGeometry(rawEntity.geometry, this.scene);
				var mesh = new THREE.Mesh(geometry, material);
				entity.object = mesh;
				this.dispatch("parsed", entity);
			// Entity has object
			// i.e. PointLight
			} else if (rawEntity.object) {
				entity = new type();
				var objectType = THREE[rawEntity.object.type];
				var objectProperties = rawEntity.object.properties;
				var object = this.applyConstructor(objectType, objectProperties);
				entity.object = object;
				this.dispatch("parsed", entity);
			// Directly call an constructor
			// i.e. ChasingCameraEntity
			} else if (rawEntity.type && rawEntity.properties) {
				var properties = this.parseProperties(rawEntity.properties, this.scene);
				entity = this.applyConstructor(type, properties);
				this.dispatch("parsed", entity);
			}
		}

	}

}