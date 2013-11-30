/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 02:06:24
*/

module HG.Resource {

	export class ResourceLoader extends HG.Core.EventDispatcher {

		baseDirectory: string;

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
		}

		resolvePath(path: string): string {
			var absPath = HG.Modules.path.join(this.baseDirectory, path);
			if (HG.Modules.fs.existsSync(absPath) === true) {
				return absPath;
			} else {
				return "";
			}
		}

		private load(relPath: string, target: HG.Resource.ILoadable, namespace: any): void {
			var absPath = HG.Modules.path.join(this.baseDirectory, relPath);
			var extension = HG.Modules.path.extname(absPath).toUpperCase().replace(".", "");
			for (var k in namespace) {
				if (extension.toUpperCase() === k) {
					var loader = new namespace[k]();
					loader.on("loaded", (model) => {
						target.load(model);
					});
					loader.load(absPath);
					return;
				}
			}
			throw new Error("No Loader for Filetype '"+HG.Modules.path.extname(absPath)+"' available.");
		}

		model(path: string, entitiy: HG.Entities.MeshEntity): void {
			this.load(path, entitiy, HG.Resource.Model);
		}

		texture(path: string, entitiy: HG.Entities.BaseEntity): void {
			this.load(path, entitiy, HG.Resource.Texture);
		}

		sound(path: string, effect: HG.Sound.Effect): void {
			this.load(path, effect, HG.Resource.Sound);
		}

		directory(directory: string): string[] {
			var path = HG.Modules.path.join(this.baseDirectory, directory);
			var files = HG.Modules.fs.readdirSync(path);
			var realFiles: string[] = [];
			files.forEach((file) => {
				realFiles.push(HG.Modules.path.join(this.baseDirectory, directory, file));
			});
			return realFiles;
		}

	}

}