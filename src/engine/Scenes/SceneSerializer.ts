/*
* @Author: BeryJu
* @Date:   2013-12-07 11:37:00
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 17:23:38
*/

module HG.Scenes {

	export class SceneSerializer extends HG.Core.EventDispatcher {

		defaultPosition: number[] = [0, 0, 0];
		defaultRotation: number[] = [0, 0, 0];
		defaultOffset: number[] = [0, 0, 0];
		defaultScale: number[] = [1, 1, 1];
		loader: HG.Resource.ResourceLoader;

		constructor(loader: HG.Resource.ResourceLoader) {
			super();
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

		private parseGeometry(raw: any, scene: HG.Scenes.BaseScene): THREE.Geometry {
			var geometryType = THREE[raw["type"]];
			var geometryProperties = this.parseProperties(raw["properties"], scene);
			var geometry;
			if (Array.isArray(geometryProperties) === true) {
				geometry = this.applyConstructor(geometryType, raw["properties"]);
			} else {
				geometry = new geometryType(raw["properties"]);
			}
			return <THREE.Geometry> geometry;
		}

		private parseColor(raw: any): THREE.Color {
			var color = new THREE.Color(0xaabbcc);
			if (raw["color"]) {
				if (Array.isArray(raw["color"]) === true) {
					color.setRGB.apply(color, raw["color"]);
				} else {
					color.setHex(raw["color"]);
				}
			}
			return color;
		}

		private parseMisc(raw: any, scene: HG.Scenes.BaseScene): void {
			var camera = this.parseEntity(raw["camera"], scene);
			scene.color = this.parseColor(raw);
			scene.colorAlpha = 1 || raw["colorAlpha"];
			// scene.camera(<HG.Entities.CameraEntity> camera);
		}

		private parseSingleMaterial(raw: any, scene: HG.Scenes.BaseScene): any {
			var material;
			var materialType;
			if (raw["properties"]["color"]) {
				raw["properties"]["color"] = this.parseColor(raw["properties"]["color"]);
			}
			var properties = this.parseProperties(raw["properties"], scene);
			if (!raw["texture"]) {
				materialType = THREE[raw["type"]];
				material = new materialType(properties);
			} else {
				var map = THREE.ImageUtils.loadTexture(this.loader.resolvePath(raw["texture"]));
				materialType = THREE[raw["type"]];
				properties["map"] = map;
				material = new materialType(properties);
			}
			return material;
		}

		private parseAbilities(raw: any, entity: HG.Entities.BaseEntity,
				scene: HG.Scenes.BaseScene): void {
			if (raw["abilities"]) {
				raw["abilities"].forEach((rawAbility) => {
					var type = HG.Abilities[rawAbility["type"]];
					var properties = this.parseProperties(rawAbility["properties"], scene);
					var keyboardBindings = rawAbility["bindings"]["keyboard"] || [];
					var mouseBindings = rawAbility["bindings"]["mouse"] || [];
					var ability = this.applyConstructor(type, properties);
					keyboardBindings.forEach((binding) => {
						var keyHandler = ability[binding["action"]];
						scene.controls.keyboard.bind(HG.settings.keys[binding["event"]],
							(delta: number, event: string) => {
							keyHandler.apply(ability, [delta, event]);
						});
					});
					mouseBindings.forEach((binding) => {
						var keyHandler = ability[binding["action"]];
						scene.controls.mouse.bind(binding["event"],
							(delta: number, event: string) => {
							keyHandler.apply(ability, [delta, event]);
						});
					});
					entity.ability(ability);
				});
			}
		}

		private setup(raw: any, entity: HG.Entities.BaseEntity): HG.Entities.BaseEntity {
			var position = this.defaultPosition || raw["position"];
			// use this so we don't have to access every single number
			entity.position.apply(entity, position);
			var rotation = this.defaultRotation || raw["rotation"];
			entity.rotate.apply(entity, rotation);
			var scale = this.defaultScale || raw["scale"];
			entity.scale.apply(entity, scale);
			var offset = this.defaultOffset || raw["offset"];
			entity.offset.apply(entity, offset);
			return entity;
		}

		private applyConstructor(type: any, argArray: any[]): any {
			var args = [null].concat(argArray);
			var factoryFunction = type.bind.apply(type, args);
			return new factoryFunction();
		}

		private parseEntity(raw: any, scene: HG.Scenes.BaseScene): HG.Entities.BaseEntity {
			var type = HG.Entities[raw["type"]];
			var entity;

			if (raw["model"]) {
				entity = new type();
				this.loader.model(raw["model"], entity);
			} else if (raw["material"] && raw["material"]) {
				entity = new type();
				var material = this.parseMaterials(raw["material"], scene);
				var geometry = this.parseGeometry(raw["geometry"], scene);
				var mesh = new THREE.Mesh(geometry, material);
				entity.object = mesh;
			} else if (raw["object"]) {
				entity = new type();
				var objectType = THREE[raw["object"]["type"]];
				var objectProperties = raw["object"]["type"];
				var object = this.applyConstructor(objectType, objectProperties);
				entity.object = object;
			} else if (raw["type"] && raw["properties"]) {
				var properties = this.parseProperties(raw["properties"], scene);
				if (Array.isArray(properties) === true) {
					entity = this.applyConstructor(type, properties);
				} else {
					entity = new type(properties);
				}
			}

			this.setup(raw, entity);
			this.parseAbilities(raw, entity, scene);
			return entity;
		}

		private parseProperties(raw: any, scene: HG.Scenes.BaseScene): any {
			var props;
			if (Array.isArray(raw) === true) {
				props = [];
				raw.forEach((prop) => {
					props.push(this.parseProperty(prop, scene));
				});
			} else {
				props = {};
				for (var k in raw) {
					props[k] = this.parseProperty(raw[k], scene);
				}
			}
			return props;
		}

		private parseProperty(raw: any, scene: HG.Scenes.BaseScene): any {
			if (typeof raw === "string") {
				if (raw.substring(0, 5) === "get::") {
					return scene.get(raw.replace("get::", ""));
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

		fromGeneric(gen: any): HG.Scenes.BaseScene {
			var scene = new HG.Scenes.BaseScene();
			gen.entities.forEach((entry) => {
				var entity = this.parseEntity(entry, scene);
				if (!entry["disabled"] || entry["disabled"] === false) {
					if (entry["name"]) {
						scene.add(entity, entry["name"]);
					} else {
						scene.add(entity);
					}
				}
			});
			this.parseMisc(gen, scene);
			return scene;
		}

	}

}