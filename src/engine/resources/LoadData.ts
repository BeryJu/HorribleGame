/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:49:03
*/
module HG {

	export module Resource {

		export interface LoadData {

			loader: HG.ResourceLoader;
			doStuff: () => boolean;

		}
		
	}

}