/*
* @Author: BeryJu
* @Date:   2013-12-01 21:20:16
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 21:10:45
*/

module HG.Locale {

	export interface HGLocaleEvent {
		eventNotAvailable: string;
		eventAdded: string;
		isEmpty: string;
		injected: string;
	}

	export interface HGLocaleErrors {
		notImplementedError: string;
		duplicateNameTag: string;
	}

	export interface HGLocaleCore {
		errors: HG.Locale.HGLocaleErrors;
	}

	export interface HGLocaleResource {
		noLoader: string;
		loaderFailure: string;
	}

	export interface HGLocalePluginHost {
		failure: string;
		success: string;
	}

	export interface HGLocaleLINQ {
		provided: string;
	}

	export interface HGLocaleSettings {
		loadedSuccess: string;
		loadedFailure: string;
		savedSuccess: string;
	}

	export interface HGLocale {
		event: HG.Locale.HGLocaleEvent;
		linq: HG.Locale.HGLocaleLINQ;
		resource: HG.Locale.HGLocaleResource;
		pluginHost: HG.Locale.HGLocalePluginHost;
		settings: HG.Locale.HGLocaleSettings;
		core: HG.Locale.HGLocaleCore;
	}

}