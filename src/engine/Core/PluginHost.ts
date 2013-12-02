/*
* @Author: BeryJu
* @Date:   2013-11-11 17:37:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:10:14
*/

module HG.Core {

	export class PluginHost extends HG.Core.EventDispatcher {

		events: string[] = ["load", "sceneChange"];
		plugins: HG.Core.IPlugin[] = [];
		paths: string[] = [];
		game: HG.Core.BaseGame;

		constructor(instance: HG.Core.BaseGame) {
			super();
			this.game = instance;
		}

		doReload(): void {
			this.paths.each((path) => {
				var resolved = global.require.resolve("./" + path);
				delete global.require.cache[resolved];
			});
		}

		load(path: string[], env?: {}): void {
			path.each((file) => {
				env = {
					HG: HG,
					THREE: THREE,
					game: this.game,
					window: window,
					document: document
				} || env;
				try {
					var plugin = <HG.Core.IPlugin> require("./" + file);
					var instance = new plugin(this, env);
					HG.locale.pluginHost.success.f(instance.name).log();
					this.plugins.push(instance);
					this.paths.push(file);
				} catch (e) {
					HG.locale.pluginHost.failure.f(file, e).log();
				}
			});
		}

	}

}