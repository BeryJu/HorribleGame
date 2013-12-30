/*
* @Author: BeryJu
* @Date:   2013-11-11 17:30:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-29 18:54:08
*/

module HG.Core {

	export class IPlugin {

		name: string = "";
		constructor(host: HG.Core.PluginHost, env: HG.Core.PluginEnv) { return; }
		frame(delta: number): void { return; }

	}

}