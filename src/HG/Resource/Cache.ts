/*
* @Author: BeryJu
* @Date:   2013-12-09 13:05:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 12:37:08
*/

module HG.Resource {

	export class CacheFile {

	}

	export class Cache {

		loader: HG.Resource.ResourceLoader;
		files: HG.Core.Collection<HG.Resource.CacheFile>;

		constructor(loader: HG.Resource.ResourceLoader) {
			this.loader = loader;
			this.files = new HG.Core.Collection<HG.Resource.CacheFile>();
		}

		cache(path: string, data?: any): boolean {
			return true;
		}

	}

}