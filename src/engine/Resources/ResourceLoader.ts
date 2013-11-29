/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:40:03
*/

module HG.Resource {

	export class ResourceLoader extends HG.Core.EventDispatcher {

		baseDirectory: string;

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
		}

		resolvePath(path: string): string {
			var absPath = global.path.join(this.baseDirectory, path);
			if (global.fs.existsSync(absPath) === true) {
				return absPath;
			} else {
				return "";
			}
		}

		fromJSModel(path: string, entitiy: HG.Entities.MeshEntity): void {
			path = global.path.join(this.baseDirectory, path);
			var jsLoader = new HG.Resource.Model.JS();
			jsLoader.on("loaded", (model) => {
				entitiy.load(model);
			});
			jsLoader.load(path);
		}

		fromSTL(path: string, entitiy: HG.Entities.MeshEntity): void {
			path = global.path.join(this.baseDirectory, path);
			var stlLoader = new HG.Resource.Model.STL();
			stlLoader.on("loaded", (model) => {
				entitiy.load(model);
			});
			stlLoader.load(path);
		}

		fromPNG(path: string, entitiy: HG.Entities.BaseEntity): void {
			path = global.path.join(this.baseDirectory, path);
			var pngLoader = new HG.Resource.Texture.PNG();
			throw new Error("NotImplementedError");
			pngLoader.on("loaded", (image) => {

			});
			pngLoader.load(path);
		}

		fromWAV(path: string, effect: HG.Sound.Effect): void {
			path = global.path.join(this.baseDirectory, path);
			var wavLoader = new HG.Resource.Sound.WAV();
			wavLoader.on("loaded", (data) => {
				//data is of type AudioBuffer
				effect.load(data);
			});
			wavLoader.load(path, effect.rootContext);
		}

		directory(directory: string): string[] {
			var path = global.path.join(this.baseDirectory, directory);
			var files = global.fs.readdirSync(path);
			var realFiles: string[] = [];
			files.forEach((file) => {
				realFiles.push(global.path.join(this.baseDirectory, directory, file));
			});
			return realFiles;
		}

	}

}