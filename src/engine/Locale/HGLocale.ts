/*
* @Author: BeryJu
* @Date:   2013-12-01 21:20:16
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:09:50
*/

module HG.Locale {

	export interface HGLocaleEvent {
		eventNotAvailable: string;
		eventAdded: string;
		isEmpty: string;
		injected: string;
	}

	export interface HGLocaleResource {
		noLoader: string;
	}

	export interface HGLocalePluginHost {
		failure: string;
		success: string;
	}

	export interface HGLocaleLINQ {
		provided: string;
	}

	export interface HGLocale {
		event: HG.Locale.HGLocaleEvent;
		linq: HG.Locale.HGLocaleLINQ;
		resource: HG.Locale.HGLocaleResource;
		pluginHost: HG.Locale.HGLocalePluginHost;
	}

	export var en: HG.Locale.HGLocale = {
		event: {
			eventAdded: "[${0}] Added EventHandler for '${1}'",
			eventNotAvailable: "[${0}] Event '${1}' not available, still added though",
			isEmpty: "Can't add empty event Handler",
			injected: "[${0}] Injected EventHandler for '${1}'"
		},
		linq: {
			provided: "[LINQ] Provided ${0}"
		},
		resource: {
			noLoader: "No Loader for Filetype ${0} available."
		},
		pluginHost: {
			failure: "[PluginHost] Failed to load Plugin ${0} because ${1}",
			success: "[PluginHost] Loaded ${0}Plugin"
		}
	};

}