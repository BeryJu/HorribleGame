/* 
* @Author: BeryJu
* @Date:   2013-11-11 17:37:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 13:36:53
*/
/// <reference path="IPlugin.ts" />
module HG {
	
	export module Plugins {

		export class PluginHost extends EventDispatcher {

			eventsAvailable: string[] = ['load', 'sceneChange'];
			plugins: HG.Plugins.IPlugin[] = [];
			paths: string[] = [];
			game: HG.BaseGame;

			constructor(instance: HG.BaseGame) {
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
					var instance = <HG.EventDispatcher> instance;
					instance.inject(event, callback);
				} catch (e) {
					HG.log("[PluginHost] Tried to inject into event "+event+
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
						var plugin = <HG.Plugins.IPlugin> require("./"+file);
						var instance = new plugin(this, env);
						HG.log("[PluginHost] Loaded "+instance.name);
						this.plugins.push(instance);
						this.paths.push(file);
					} catch (e) {
						HG.log("[PluginHost] Failed to load Plugin "+file+" because "+e);
					}
				});
			}

			frame(delta: number) {
				this.plugins.forEach((plugin) => {
					plugin.frame(delta);
				});
			}

		}

	}

}