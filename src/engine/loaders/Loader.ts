/* 
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-16 17:31:39
*/
module HG {

	export class Loader extends EventDispatcher {

		baseDirectory: string = "";

		constructor(baseDirectory: string) {
			super();
			this.baseDirectory = baseDirectory;
			// var map = HG.Loaders.Model;
			// for (var k in map) {
			// 	this['from'+k] = (path: string) => {
			// 		var loader = new HG.Loaders.Model[k](path);
			// 		loader.on('loaded', (model) => {
			// 			this.object = new THREE.Mesh(model.geometry, model.material);
			// 			this.dispatch('loaded', model.geometry, model.material);
			// 		});
			// 	}
			// }
		}

		directory(directory: string): string[] {
			var path = global.path.join(this.baseDirectory, directory);
			var files = global.fs.readdirSync(path);
			files.forEach((file) => {
				file = global.path.join(this.baseDirectory, directory, file);
			});
			return files;
		}

	}

}