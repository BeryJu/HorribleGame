/*
* @Author: BeryJu
* @Date:   2013-11-16 14:05:20
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:40:21
*/

module HG.Resource {

	export interface IFiletype {

		load(path: string, ...args): any;

	}

}