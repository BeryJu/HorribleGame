/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 14:03:53
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

		model(path: string, entitiy: HG.Entities.MeshEntity, ...args: any[]): void {
			this.load(path, HG.Resource.Model, entitiy, args);
		}

		sound(path: string, effect: HG.Sound.Effect): void {
			this.load(path, HG.Resource.Sound, effect);
		}

		texture(path: string): THREE.Texture {
			var tex = THREE.ImageUtils.loadTexture(this.path(path));
			tex.anisotropy = HG.settings.graphics.aa;
			return tex;
		}

		queueTexture(paths: string[], done: (textures: THREE.Texture[]) => void): void {
			var queue = [];
			paths.forEach((path) => {
				queue.push((next: Function) => {
					next(this.texture(path));
				});
			});
			HG.Utils.queue(queue, done);
		}

		scene(path: string, done: (scene: HG.Scenes.Scene) => void): void {
			var serializer =  new HG.Scenes.Serializer.SceneSerializer(this);
			serializer.on("done", done);
			serializer.fromGeneric(this.json<any>(path));
		}

		queueScene(paths: string[], done: (scenes: HG.Scenes.Scene[]) => void): void {
			var queue = [];
			paths.forEach((path) => {
				queue.push((next: Function) => {
					this.scene(path, (scene: HG.Scenes.Scene) => {
						next(scene);
					});
				});
			});
			HG.Utils.queue(queue, done);
		}

		queueJSON<T>(paths: string[], done: (scenes: T[]) => void): void {
			var queue = [];
			paths.forEach((path, index) => {
				queue.push((next: Function) => {
					next(this.json<T>(path));
				});
			});
			HG.Utils.queue(queue, done);
		}

		shader(path: string): {
			vertex: string;
			fragment: string;
			extend: Function;
		} {
			var raw = this.json<HG.Core.Shader>(path);
			var extend = function(d: {}) {
				for (var k in d) {
					raw[k] = d[k];
				}
				return raw;
			};
			return {
				vertex: raw.vertex,
				fragment: raw.fragment,
				extend: extend
			};
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

		directory(directory: string, extension: string = ""): Array<string> {
			var path = HG.Modules.path.join(this.baseDirectory, directory);
			var files = HG.Modules.fs.readdirSync(path);
			var realFiles = [];
			files.forEach((file) => {
				if (file.indexOf(extension) !== -1) {
					realFiles.push(HG.Modules.path.join(this.baseDirectory, directory, file));
				}
			});
			return realFiles;
		}

	}

}