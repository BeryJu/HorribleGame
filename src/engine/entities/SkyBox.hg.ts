/// <reference path="../BaseEntity.ts" />
/*
* SkyBox.hg.ts
* Author: BeryJu
*/

module HG {
	
	export module Entities {

		export class SkyBoxEntity extends BaseEntity {

			constructor(directory: string, 
					size: number = 5000,
					directions: string[] = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"],
					suffix: string = ".png") {
				super();
				var skyGeometry = new THREE.CubeGeometry(size, size, size);
				
				var materialArray = [];
				for (var i = 0; i < 6; i++) {
					materialArray.push( new THREE.MeshBasicMaterial({
						map: THREE.ImageUtils.loadTexture(directory + directions[i] + suffix),
						side: THREE.BackSide
					}));
				}
				var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
				this.object = new THREE.Mesh(skyGeometry, skyMaterial);
			}

		}

	}

}
