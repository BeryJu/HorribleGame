/*
* @Author: BeryJu
* @Date:   2013-11-11 12:15:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 19:42:01
*/

module HG {

	export var settings: HG.Utils.ISettings;

	export function loadSettings(path: string, fallback?: HG.Utils.ISettings): HG.Utils.ISettings {
		var raw = HG.Modules.fs.readFileSync(path);
		fallback = fallback || new HG.Utils.ISettings();
		try {
			HG.locale.settings.loadedSuccess.log();
			return <HG.Utils.ISettings> JSON.parse(raw);
		} catch (e) {
			HG.locale.settings.loadedFailure.log();
			return fallback || new HG.Utils.ISettings();
		}
		return new HG.Utils.ISettings();
	}

	export function saveSettings(path: string, settings: HG.Utils.ISettings,
		pretty: boolean = false): void {
		var parsed;
		if (pretty === true) {
			parsed = JSON.stringify(settings, null , "\t");
		} else {
			parsed = JSON.stringify(settings);
		}
		HG.Modules.fs.writeFile(path, parsed);
		HG.locale.settings.savedSuccess.log();
	}

}