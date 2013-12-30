// /*
// * @Author: BeryJu
// * @Date:   2013-11-06 14:36:09
// * @Email:  jenslanghammer@gmail.com
// * @Last Modified by:   BeryJu
// * @Last Modified time: 2013-11-18 20:13:30
// */

module HG.Entities {

	export class SkyBoxEntity extends HG.Entities.Entity {

		constructor(textures: HG.Core.Hash<string, THREE.Texture>,
					size: number = 5000) {
			super();
			var skyGeometry = new THREE.CubeGeometry(size, size, size);

			var materialArray = [];
			textures.forEach((texture: THREE.Texture, key: string) => {
				console.log(texture);
				materialArray.push(new THREE.MeshBasicMaterial({
					map: texture
				}));
			});
			var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
			this.object = new THREE.Mesh(skyGeometry, skyMaterial);
		}

	}

}