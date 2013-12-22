/*
* @Author: BeryJu
* @Date:   2013-11-11 17:30:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 12:27:04
*/
/// <reference path="PluginHost.ts" />
module HG.Core {

	export class IPlugin {

		name: string = "";
		constructor(host: HG.Core.PluginHost, env: {
			HG: any;
			THREE: any;
			game: HG.Core.BaseGame;
			window: Window;
			document: Document;
		}) { return; }
		frame(delta: number): void { return; }

	}

}