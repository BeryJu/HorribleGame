/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-13 16:24:22
*/

module HG.Resource {

	export class ResourceLoader extends HG.Core.EventDispatcher {

		baseDirectory: string;

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
			var settings = "settings.json";
			HG.settings = this.json<HG.Utils.ISettings>(settings);
			HG.locale = this.json<HG.Locale.LocaleDefinition>(HG.settings.hgLocale);
		}

		path(path: string, silent?: boolean): string {
			var absPath = HG.Modules.path.join(this.baseDirectory, path);
			if (HG.Modules.fs.existsSync(absPath) === true) {
				return absPath;
			} else {
				if (silent || silent === false) {
					HG.locale.errors.fileNotExisting.f(path).error();
				}
				return "";
			}
		}

		private load(relPath: string, namespace: any, target: HG.Resource.ILoadable,
					...args: any[]): void;
		private load(relPath: string, namespace: any, target: (data: any) => any,
					...args: any[]): void;
		private load(relPath: string, namespace: any, target?: any, ...args: any[]): void {
			var absPath = this.path(relPath);
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
					var a = [absPath].concat(args);
					loader.load.apply(loader, a);
					foundLoader = true;
				}
			}
			if (foundLoader === false) {
				HG.locale.resource.noLoader.f(extension).error();
			}
		}

		shader(path: string): THREE.ShaderMaterial {

			return null;
		}

		model(path: string, entitiy: HG.Entities.MeshEntity, ...args: any[]): void {
			this.load(path, HG.Resource.Model, entitiy, args);
		}

		texture(path: string, entitiy: HG.Entities.BaseEntity): void {
			this.load(path, HG.Resource.Texture, entitiy);
		}

		sound(path: string, effect: HG.Sound.Effect): void {
			this.load(path, HG.Resource.Sound, effect);
		}

		scene(path: string, done: (scene: HG.Scenes.BaseScene) => void): void {
			var absPath = this.path(path);
			var raw = HG.Modules.fs.readFileSync(absPath);
			var serializer =  new HG.Scenes.Serializer.SceneSerializer(this);
			serializer.on("done", done);
			serializer.fromGeneric(JSON.parse(raw));
		}

		json<T>(path: string, data?: T): T {
			path = this.path(path);
			if (data) {
				HG.Modules.fs.writeFile(JSON.stringify(data), (err) => {
					if (err) throw err;
				});
				return null;
			} else if (HG.Modules.fs.existsSync(path) === true) {
				var raw = HG.Modules.fs.readFileSync(path);
				return <T> JSON.parse(raw);
			} else {
				return null;
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