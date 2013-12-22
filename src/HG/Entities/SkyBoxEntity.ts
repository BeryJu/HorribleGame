// /*
// * @Author: BeryJu
// * @Date:   2013-11-06 14:36:09
// * @Email:  jenslanghammer@gmail.com
// * @Last Modified by:   BeryJu
// * @Last Modified time: 2013-11-18 20:13:30
// */

module HG.Entities {

	export class SkyBoxEntity extends HG.Entities.Entity {

		constructor(textures: THREE.Texture[],
					order: string[] = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"],
					size: number = 5000) {
			super();
			var skyGeometry = new THREE.CubeGeometry(size, size, size);

			var materialArray = [];
			order.forEach((d, i) => {
				materialArray.push(new THREE.MeshBasicMaterial({
					map: textures[i],
					side: THREE.BackSide
				}));
			});
			var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
			this.object = new THREE.Mesh(skyGeometry, skyMaterial);
		}

	}

}