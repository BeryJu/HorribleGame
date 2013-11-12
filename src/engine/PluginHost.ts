/* 
* @Author: BeryJu
* @Date:   2013-11-11 17:37:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-12 16:54:37
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

			hook(instance: any, event: any, callback: (...args) => any): void {
				try {
					instance = <HG.EventDispatcher> instance;
					instance.inject(event, callback);
					console.log("[PluginHost] Injected into event "+event+
						" from "+instance['constructor']['name']);
				} catch (e) {
					console.log("[PluginHost] Tried to inject into event "+event+
						" from "+instance['constructor']['name']);
				}
			}

			load(path: string) {
				var plugin = <HG.Plugins.IPlugin> require("./"+path);
				var env = {
					HG: HG,
					THREE: THREE,
					game: this.game,
					window: window,
					document: document
				};
				try {
					var instance = new plugin(this, env);
					console.log("[PluginHost] Loaded "+instance.name);
					this.plugins.push(instance);
					this.paths.push(path);
				} catch (e) {
					console.log("[PluginHost] Failed to load Plugin "+path+" because "+e);
				}
			}

			frame(delta: number) {
				this.plugins.forEach((plugin) => {
					plugin.frame(delta);
				});
			}

		}

	}

}