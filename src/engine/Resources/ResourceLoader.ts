/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 21:20:04
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

		private load(relPath: string, namespace: any, target: HG.Resource.ILoadable): void;
		private load(relPath: string, namespace: any, target: (data: any) => any): void;
		private load(relPath: string, namespace: any, target?: any): void {
			var absPath = HG.Modules.path.join(this.baseDirectory, relPath);
			var extension = HG.Modules.path.extname(absPath);
			var extensionName = extension.toUpperCase().replace(".", "");
			var foundLoader = false;
			var isOk = false;
			for (var k in namespace) {
				if (k === extensionName) {
					var loader = new namespace[k]();
					if (target["load"]) {
						loader.on("loaded", (data) => {
							target.load(data);
						});
					} else {
						loader.on("loaded", (data) => {
							target(data);
						});
					}
					loader.load(absPath);
					foundLoader = true;
				}
			}
			if (foundLoader === false) {
				HG.locale.resource.noLoader.f(extension).error();
			}
		}

		model(path: string, entitiy: HG.Entities.MeshEntity): void {
			this.load(path, HG.Resource.Model, entitiy);
		}

		texture(path: string, entitiy: HG.Entities.BaseEntity): void {
			this.load(path, HG.Resource.Texture, entitiy);
		}

		sound(path: string, effect: HG.Sound.Effect): void {
			this.load(path, HG.Resource.Sound, effect);
		}

		locale(path: string, fn: (locale: HG.Locale.Locale) => any): void {
			// Gotta do this because EventDispatcher and the Resource Loader
			// don't work without having a Locale loaded
			var absPath = HG.Modules.path.join(this.baseDirectory, path);
			try {
				var raw = HG.Modules.fs.readFileSync(absPath);
				fn(JSON.parse(raw));
			} catch (e) {
				throw e;
			}
		}

		directory(directory: string): Array<string> {
			var path = HG.Modules.path.join(this.baseDirectory, directory);
			var files = HG.Modules.fs.readdirSync(path);
			var realFiles = [];
			files.forEach((file) => {
				realFiles.push(HG.Modules.path.join(this.baseDirectory, directory, file));
			});
			return realFiles;
		}

	}

}