/*
* @Author: BeryJu
* @Date:   2013-11-20 14:10:47
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 19:14:40
*/

module HG.Resource.Settings {

	export class JSONSettings extends HG.Core.EventDispatcher implements HG.Resource.IFiletype {

		events: string[] = ["loaded"];

		load(path: string, fallback?: any) {
			try {
				var raw = HG.Modules.fs.readFileSync(path);
				this.dispatch("loaded", <HG.Utils.ISettings> JSON.parse(raw));
			} catch (e) {
				HG.locale.resource.loaderFailure.f("JSONSettings", path).error();
			}
		}

	}

}