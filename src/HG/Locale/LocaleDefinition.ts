/*
* @Author: BeryJu
* @Date:   2013-12-01 21:20:16
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-09 14:23:05
*/

module HG.Locale {

	export interface LocaleDefinition {
		core: {
			errors: {
				notImplementedError: string;
				nullReferenceError: string;
				duplicateNameTagError: string;
				defaultSettingsUsedWarning: string;
			}
		};
		event: {
			eventNotAvailable: string;
			eventAdded: string;
			isEmpty: string;
			injected: string;
		};
		linq: {
			provided: string;
		};
		resource: {
			noLoader: string;
			loaderFailure: string;
		};
		pluginHost: {
			failure: string;
			success: string;
		};
		settings: {
			loadedSuccess: string;
			loadedFailure: string;
			savedSuccess: string;
		};
		utils: {
			updateChecker: {
				newThree: string;
				noThree: string;
			}
		}
	}

}