/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:33
*/
module HG {

	export class Loader extends EventDispatcher {

		baseDirectory: string = "";

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
		}

		model(path: string): HG.Loaders.LoadData {
			path.replaceAll("/", global.path.sep);
			var jsLoader = new HG.Loaders.Model.JS();
			jsLoader.on("loaded")
			return { loader: this, doStuff: function() { return true; } };
		}

		directory(directory: string): string[] {
			var path = global.path.join(this.baseDirectory, directory);
			var files = global.fs.readdirSync(path);
			var realFiles: string[] = [];
			files.forEach((file) => {
				realFiles.push(global.path.join(this.baseDirectory, directory, file));
			});
			return realFiles;
		}

	}

}