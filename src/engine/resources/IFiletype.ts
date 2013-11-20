/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:05:20
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 15:31:18
*/
module HG {

	export module Resource {

		export interface IFiletype {

			load(path: string, ...args): any;

		}

	}

}