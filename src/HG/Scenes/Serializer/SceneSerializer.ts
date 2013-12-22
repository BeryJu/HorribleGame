/*
* @Author: BeryJu
* @Date:   2013-12-07 11:37:00
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 11:35:50
*/

module HG.Scenes.Serializer {

	export class SceneSerializer extends HG.Core.EventDispatcher {

		loader: HG.Resource.ResourceLoader;
		done: number = 0;

		constructor(loader: HG.Resource.ResourceLoader) {
			super(["done"]);
			this.loader = loader;
		}

		fromGeneric(generic: any): void {
			generic = <HG.Scenes.Serializer.SceneDefinition> generic;
			var scene = new HG.Scenes.Scene();
			scene.color = HG.Utils.parseColor(generic.color);
			scene.colorAlpha = 1 || generic.colorAlpha;
			var allEntities = generic.entities.concat(generic.cameras);
			var index: number = 0;
			var nextEntity = (entry: any, scene: HG.Scenes.Scene) => {
				var parser = new HG.Scenes.Serializer.EntityParser(scene, this.loader);
				parser.on("parsed", (entity) => {
					scene.add(entity);
					index++;
					if (index < allEntities.length) {
						nextEntity(allEntities[index], scene);
					} else {
						scene.camera(generic.initialCamera);
						this.dispatch("done", scene);
					}
				});
				parser.parse(entry);
			};
			nextEntity(allEntities[index], scene);
		}

	}

}