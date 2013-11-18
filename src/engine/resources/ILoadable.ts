/* 
* @Author: BeryJu
* @Date:   2013-11-18 21:44:04
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:48:57
*/
module HG {

	export module Resource {

		export interface ILoadable {

			load(data: HG.Resource.LoadData): void;

		}

	}

}