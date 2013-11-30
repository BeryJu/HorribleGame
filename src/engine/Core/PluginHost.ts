/*
* @Author: BeryJu
* @Date:   2013-11-11 17:37:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 20:58:52
*/

module HG.Core {

	export class PluginHost extends HG.Core.EventDispatcher {

		events: string[] = ['load', 'sceneChange'];
		plugins: HG.Core.IPlugin[] = [];
		paths: string[] = [];
		game: HG.Core.BaseGame;

		constructor(instance: HG.Core.BaseGame) {
			super();
			this.game = instance;
		}

		doReload(): void {
			this.paths.forEach((path) => {
				var resolved = global.require.resolve("./"+path);
				delete global.require.cache[resolved];
			});
		}

		hook(instance: any, event: any, callback: (...args: any[]) => any): void {
			try {
				var instance = < HG.Core.EventDispatcher > instance;
				instance.inject(event, callback);
			} catch (e) {
				console.log("[PluginHost] Tried to inject into event "+event+
					" from "+instance['constructor']['name']);
			}
		}

		load(path: string[], env?: {}): void {
			path.forEach((file) => {
				env = {
					HG: HG,
					THREE: THREE,
					game: this.game,
					window: window,
					document: document
				} || env;
				try {
					var plugin = <HG.Core.IPlugin> require("./"+file);
					var instance = new plugin(this, env);
					console.log("[PluginHost] Loaded "+instance.name+"Plugin");
					this.plugins.push(instance);
					this.paths.push(file);
				} catch (e) {
					console.log("[PluginHost] Failed to load Plugin "+file+" because "+e);
				}
			});
		}

	}

}