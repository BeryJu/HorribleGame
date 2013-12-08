/*
* @Author: BeryJu
* @Date:   2013-12-07 11:37:00
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-08 15:09:30
*/

module HG.Scenes.Serializer {

	export class SceneSerializer extends HG.Core.EventDispatcher {

		loader: HG.Resource.ResourceLoader;
		done: number = 0;

		constructor(loader: HG.Resource.ResourceLoader) {
			super(["done"]);
			this.loader = loader;
		}

		private parseMisc(raw: any, scene: HG.Scenes.BaseScene): void {
			var parser = new HG.Scenes.Serializer.EntityParser(scene, this.loader);
			parser.on("parsed", (entity) => {
				scene.color = parser.parseColor(raw.color);
				scene.colorAlpha = 1 || raw.colorAlpha;
				scene.camera = <HG.Entities.CameraEntity> entity;
				this.dispatch("done", scene);
			});
			parser.parse(raw.camera);
		}

		fromGeneric(gen: any): void{
			var scene = new HG.Scenes.BaseScene();
			gen.entities.forEach((entry, index) => {
				this.done--;
				var parser = new HG.Scenes.Serializer.EntityParser(scene, this.loader);
				parser.on("parsed", (entity) => {
					if (entry.name) {
						scene.add(entity, entry.name);
					} else {
						scene.add(entity);
					}
					this.done++;
					if (this.done === 0) {
						this.parseMisc(gen, scene);
					}
				});
				parser.parse(entry);
			});
		}

	}

}