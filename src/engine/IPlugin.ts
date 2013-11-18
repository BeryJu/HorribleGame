/* 
* @Author: BeryJu
* @Date:   2013-11-11 17:30:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:31
*/
/// <reference path="PluginHost.ts" />
module HG {

	export module Plugins {

		export class IPlugin {

			name: string = "";
			constructor(host: HG.Plugins.PluginHost, env: {}) {}
			frame(delta: number): void {}

		}
		
	}

}