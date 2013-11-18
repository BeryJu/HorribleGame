/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:05:20
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:33
*/
module HG {

	export module Loaders {

		export interface IFiletype {

			load(path: string): any;

		}

	}

}