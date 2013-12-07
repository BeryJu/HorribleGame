/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 12:11:03
*/

module HG.Resource {

	export class ResourceLoader extends HG.Core.EventDispatcher {

		baseDirectory: string;

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
			var suspectSettingsFile = "settings.json";
			var settingsPath = HG.Modules.path.join(this.baseDirectory, suspectSettingsFile);
			if (HG.Modules.fs.existsSync(settingsPath) === true) {
				this.settings(suspectSettingsFile);
			}
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
					var handler;
					if (target["load"]) {
						handler = (data) => {
							target.load(data);
						};
					} else {
						handler = (data) => {
							target(data);
						};
					}
					loader.on("loaded", handler);
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

		scene(path: string): HG.Scenes.BaseScene {
			var realPath = HG.Modules.path.join(this.baseDirectory, path);
			if (HG.Modules.fs.existsSync(realPath) === true) {
				var raw = HG.Modules.fs.readFileSync(realPath);
				return new HG.Scenes.SceneSerializer().fromGeneric(JSON.parse(raw), this);
			} else {
				return null;
			}
		}

		json<T>(path: string): T {
			var realPath = HG.Modules.path.join(this.baseDirectory, path);
			if (HG.Modules.fs.existsSync(realPath) === true) {
				var raw = HG.Modules.fs.readFileSync(realPath);
				return <T> JSON.parse(raw);
			} else {
				return null;
			}
		}

		settings(path: string): void {
			var absPath = HG.Modules.path.join(this.baseDirectory, path);
			var raw = HG.Modules.fs.readFileSync(absPath);
			HG.settings = <HG.Utils.ISettings> JSON.parse(raw);
			var localePath = HG.Modules.path.join(this.baseDirectory, HG.settings.hgLocale);
			HG.locale = JSON.parse(HG.Modules.fs.readFileSync(localePath));
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