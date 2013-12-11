/*
* @Author: BeryJu
* @Date:   2013-12-09 13:05:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-09 14:04:50
*/

module HG.Resource {

	export class Cache {

		loader: HG.Resource.ResourceLoader;
		files: {};

		constructor(loader: HG.Resource.ResourceLoader) {
			this.loader = loader;
		}

		cache(path: string, data?: any): boolean {
			return true;
		}

	}

}