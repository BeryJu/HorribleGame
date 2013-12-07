/*
* @Author: BeryJu
* @Date:   2013-12-07 11:37:00
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 12:55:52
*/

module HG.Scenes {

	export class SceneSerializer extends HG.Core.EventDispatcher {

		defaultPosition: number[] = [0, 0, 0];
		defaultRotation: number[] = [0, 0, 0];
		defaultOffset: number[] = [0, 0, 0];
		defaultScale: number[] = [1, 1, 1];

		private parseMaterial(raw: any, loader: HG.Resource.ResourceLoader): THREE.Material {
			var materialType = THREE[["type"]];
			var material = new materialType(["properties"]);
			return material;
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

		private applyConstructor<T>(type: T, args: any[]): T {
			var args = [null].concat(argArray);
			var factoryFunction = constructor.bind.apply(constructor, args);
			return <T> (new factoryFunction());
		}

		private parseGeometry(raw: any): THREE.Geometry {
			var geometryType = THREE[raw["type"]];
			var geometryProperties = raw["properties"];
			var geometry;
			if (Array.isArray(geometryProperties) === true) {
				geometry = this.applyConstructor<geometryType>(geometryType, raw["properties"]);
			} else {
				geometry = new geometryType(raw["properties"]);
			}
			return <THREE.Geometry> geometry;
		}

		fromGeneric(gen: any, loader: HG.Resource.ResourceLoader): HG.Scenes.BaseScene {
			var scene = new HG.Scenes.BaseScene();

			gen.entities.forEach((entry) => {
				var type = HG.Entities[entry["type"]];
				var entity = new type();
				if (entry["model"]) {
					loader.model(entry["model"], entity);
				} else if (entry["texture"]) {

				} else if (entry["material"] && entry["material"]) {
					var material = this.parseMaterial(entry["material"]);
					var geometry = this.parseGeometry(entry["geometry"])
					var mesh = new THREE.Mesh(geometry, material);
					entity.object = mesh;
				} else if (entry["object"]) {
					var objectType = THREE[entry["object"]["type"]];
					var objectProperties = entry["object"]["type"];
					var object = applyToConstructor(objectType, objectProperties);
				}
				this.setup(entity);
				if (!entry["disabled"] || entry["disabled"] === false) {
					if (entry["name"]) {
						scene.add(entity, entry["name"]);
					} else {
						scene.add(entity);
					}
				}
			});
			return scene;
		}

	}

}