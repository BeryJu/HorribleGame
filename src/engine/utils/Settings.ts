/* 
* @Author: BeryJu
* @Date:   2013-11-11 12:15:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:36
*/
/// <reference path="SettingsStructure.ts" />
module HG {

	export var Settings: HG.SettingsStructure;

	export function loadSettings(path: string, fallback?: HG.SettingsStructure): HG.SettingsStructure {
		var raw = global.fs.readFileSync(path);
		try {
			console.log("[Settings] Loaded Settings from JSON.");
			return <HG.SettingsStructure> JSON.parse(raw);
		} catch (e) {
			console.log("[Settings] Failed to load settings, used fallback.");
			return fallback || new HG.SettingsStructure();
		}
		return new HG.SettingsStructure();
	}

	export function saveSettings(path: string, settings: HG.SettingsStructure, pretty: boolean = false): void {
		var parsed;
		if (pretty === true) {
			parsed = JSON.stringify(settings, null , "\t");
		} else {
			parsed = JSON.stringify(settings);
		}
		global.fs.writeFile(path, parsed, () => {});
		console.debug("[Settings] Saved settings.");
	}

}