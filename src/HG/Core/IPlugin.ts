/*
* @Author: BeryJu
* @Date:   2013-11-11 17:30:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:10:42
*/
/// <reference path="PluginHost.ts" />
module HG.Core {

	export class IPlugin {

		name: string = "";
		constructor(host: HG.Core.PluginHost, env: {}) { return; }
		frame(delta: number): void { return; }

	}

}