/*
* @Author: BeryJu
* @Date:   2013-12-01 21:20:16
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-13 15:37:05
*/

module HG.Locale {

	export interface LocaleDefinition {
		errors: {
			notImplementedError: string;
			nullReferenceError: string;
			duplicateNameTagError: string;
			defaultSettingsUsedWarning: string;
			fileNotExisting: string;
		};
		debug: {
			geometries: string;
			programs: string;
			textures: string;
			calls: string;
			faces: string;
			points: string;
			vertices: string;
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