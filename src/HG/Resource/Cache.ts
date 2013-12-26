/*
* @Author: BeryJu
* @Date:   2013-12-09 13:05:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 17:56:16
*/

module HG.Resource {

	export enum CacheResults {
		Added = 0,
		AlreadyExists = 1,
		Updated = 2,
		Failure = 3
	}

	export class Cache {

		loader: HG.Resource.ResourceLoader;
		files: HG.Core.Hash<any, string>;

		constructor(loader: HG.Resource.ResourceLoader) {
			this.loader = loader;
			this.files = new HG.Core.Hash<any, string>();
		}

		cache(path: string, data?: any): HG.Resource.CacheResults {
			if (this.files.indexOf(path) !== -1) {
				var oldData = this.files.key(path);
				if (oldData === data) {
					return HG.Resource.CacheResults.AlreadyExists;
				} else {
					if (this.files.set(path, data) === true) {
						return HG.Resource.CacheResults.Updated;
					} else {
						return HG.Resource.CacheResults.Failure;
					}
				}
			} else {
				this.files.push(path, data);
				return HG.Resource.CacheResults.Added;
			}
		}

	}

}