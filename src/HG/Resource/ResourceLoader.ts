/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-25 01:55:59
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
				return null;
			}
		}

		private load(relPath: string, namespace: any, ...loaderArgs: any[]):
				HG.Core.EventDispatcher {
			var absPath = this.path(relPath);
			var extension = HG.Modules.path.extname(absPath);
			var extensionName = extension.toUpperCase().replace(".", "");
			var dispatcher = new HG.Core.EventDispatcher(["loaded"]);
			dispatcher["_on"] = dispatcher.on;
			dispatcher.on = (name: any, eventHandler?: Function): HG.Core.EventDispatcher => {
				dispatcher["_on"](name, eventHandler);
				var foundLoader = false;
				for (var k in namespace) {
					if (k === extensionName) {
						var loader = new namespace[k]();
						loader.on("loaded", (...args: any[]) => {
							args.splice(0, 0, "loaded");
							dispatcher.dispatch.apply(dispatcher, args);
						});
						loaderArgs.splice(0, 0, absPath);
						loader.load.apply(loader, loaderArgs);
						foundLoader = true;
					}
				}
				if (foundLoader === false) {
					HG.locale.resource.noLoader.f(extension).error();
				}
				return dispatcher;
			};
			return dispatcher;
		}

		model(path: string, ...args: any[]): HG.Core.EventDispatcher {
			return this.load(path, HG.Resource.Model, args);
		}

		sound(path: string, ...args: any[]): HG.Core.EventDispatcher {
			return this.load(path, HG.Resource.Sound, args);
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
			var extend = function(d: any) {
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