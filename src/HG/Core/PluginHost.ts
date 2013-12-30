/*
* @Author: BeryJu
* @Date:   2013-11-11 17:37:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-29 18:08:57
*/

module HG.Core {

	export interface PluginEnv {
		HG: any;
		THREE: any;
		game: HG.Core.BaseGame;
		window: Window;
		document: Document;
	}

	export class PluginHost extends HG.Core.EventDispatcher {

		events: string[] = ["load", "sceneChange"];
		plugins: HG.Core.IPlugin[] = [];
		paths: string[] = [];
		game: HG.Core.BaseGame;

		constructor(instance: HG.Core.BaseGame) {
			super();
			this.game = instance;
		}

		load(path: string[], env?: HG.Core.PluginEnv): void {
			env = {
				HG: HG,
				THREE: THREE,
				game: this.game,
				window: window,
				document: document
			} || env;
			path.forEach((file) => {
				var plugin = require("./" + file);
				var instance = new plugin(this, env);
				HG.locale.pluginHost.success.f(instance.name).log();
				this.plugins.push(instance);
				this.paths.push(file);
			});
		}

	}

}