/*
* @Author: BeryJu
* @Date:   2013-12-06 17:35:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 18:03:43
*/

module HG.Utils {

	export class UpdateChecker {

		threeUrl: string = "https://api.github.com/repos/mrdoob/three.js/releases";
		// nwUrl: string = "https://api.github.com/repos/rogerwang/node-webkit/releases"

		constructor() {
			this.checkThree((downloadUrl: string, version: string) => {
				HG.locale.utils.updateChecker.newThree.f(version, downloadUrl).log();
			}, (version: string) => {
				HG.locale.utils.updateChecker.noThree.f(version).log();
			});
		}

		downloadString(url: string, fn: (res: any) => any): void {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(req) {
				if (this.readyState === 4) {
					fn(JSON.parse(this.responseText));
				}
			};
			req.open("GET",url, true);
			req.send();
		}

		checkThree(onNew: (downloadUrl: string, version: string) => any,
					noNew: (version: string) => any): void {
			this.downloadString(this.threeUrl, (res) => {
				var latest = res[0];
				var revision = parseInt(latest["name"].replace("r", ""), 0);
				var threer = parseInt(THREE.REVISION, 0);
				if (revision > threer) {
					// there is a new version
					onNew(latest["html_url"], latest["name"]);
				} else {
					noNew(latest["name"]);
				}
			});
		}

		// checkNw(onNew: (downloadUrl: string) => any): void {
		// 	this.downloadString(this.threeUrl, (res) => {
		// 		var latest = res[0];
		// 		var revision = parseInt(latest["name"].replace("r", ""), 0);
		// 		var threer = THREE.REVISION;
		// 		if (revision > threer) {
		// 			// there is a new version
		// 			onNew(latest["html_url"])
		// 		}
		// 	});
		// }

	}

}