/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 02:05:43
*/

module HG.Resource {

	export class Loader extends HG.Core.EventDispatcher {

		baseDirectory: string;
		cache: HG.Resource.Cache;

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
			this.cache = new HG.Resource.Cache(this);
			var settings = "settings.json";
			HG.settings = this.json<HG.Utils.ISettings>(settings);
			HG.locale = this.json<HG.Locale.LocaleDefinition>(HG.settings.hgLocale);
		}

		path(path: string): string {
			var absPath = HG.Modules.path.join(this.baseDirectory, path);
			if (HG.Modules.fs.existsSync(absPath) === true) {
				return absPath;
			} else {
				HG.locale.errors.fileNotExisting.f(path).error();
				return null;
			}
		}

		private load(relPath: string, namespace: any, silent: boolean, loaderArgs: any[]):
					HG.Core.EventDispatcher {
			var absPath = this.path(relPath);
			var extension = HG.Modules.path.extname(absPath);
			var extensionName = extension.toUpperCase().replace(".", "");
			var dispatcher = new HG.Core.EventDispatcher(["loaded"], silent);
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

		model(path: string, silent: boolean = false, ...args: any[]): HG.Core.EventDispatcher {
			return this.load(path, HG.Resource.Model, silent, args);
		}

		sound(path: string, silent: boolean = false, ...args: any[]): HG.Core.EventDispatcher {
			return this.load(path, HG.Resource.Sound, silent, args);
		}

		video(path: string, silent: boolean = false, ...args: any[]): HG.Core.EventDispatcher {
			return this.load(path, HG.Resource.Video, silent, args);
		}

		texture(path: string, silent: boolean = false, ...args: any[]): HG.Core.EventDispatcher {
			return this.load(path, HG.Resource.Texture, silent, args);
		}

		queueTexture(paths: string[],
			done: (textures: HG.Core.Hash<string, THREE.Texture>) => void): void {
			// var queue = new HG.Core.Hash<string, Function>();
			// paths.forEach((path) => {
			// 	queue.push(HG.Modules.path.basename(path, HG.Modules.path.extname(path)),
			//		(next: Function) => {
			// 		this.texture(path, true).on("loaded", (texture: THREE.Texture) => {
			// 			next(texture);
			// 		});
			// 	});
			// });
			// HG.Core.Queue<string, THREE.Texture>(queue, done);
			var queue = new HG.Core.Queue<string, THREE.Texture>();
			paths.forEach((path) => {
				queue.call(HG.Modules.path.basename(path, HG.Modules.path.extname(path)),
					(next: Function) => {
						this.texture(path, true).on("loaded", (texture: THREE.Texture) => {
							next(texture);
						});
					});
			});
			queue.on("done", done);
			queue.start();
		}

		queueJSON<T>(paths: string[], done: (jsons: HG.Core.Hash<string, T>) => void): void {
			// var queue = new HG.Core.Hash<string, Function>();
			// paths.forEach((path) => {
			// 	queue.push(path, (next: Function) => {
			// 		next(this.json<T>(path));
			// 	});
			// });
			// HG.Core.Queue<string, T>(queue, done);
			var queue = new HG.Core.Queue<string, T>();
			paths.forEach((path) => {
				queue.call(path, (next: Function) => {
					next(this.json<T>(path));
				});
			});
			queue.on("done", done);
			queue.start();
		}

		shader(path: string): HG.Core.Shader {
			var raw = this.json<HG.Core.Shader>(path);
			return new HG.Core.Shader(raw.vertex, raw.fragment);
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