// /*
// * @Author: BeryJu
// * @Date:   2013-11-06 14:36:09
// * @Email:  jenslanghammer@gmail.com
// * @Last Modified by:   BeryJu
// * @Last Modified time: 2013-11-18 20:13:30
// */


//  _____  _____ _____            _____
// / ____|/ ____|  __ \     /\   |  __ \
//| (___ | |    | |__) |   /  \  | |__) |
// \___ \| |    |  _  /   / /\ \ |  ___/
// ____) | |____| | \ \  / ____ \| |
//|_____/ \_____|_|  \_\/_/    \_\_|
//

// /// <reference path="BaseEntity.ts" />

// module HG {

// 	export module Entities {

// 		export class SkyBoxEntity extends BaseEntity {

// 			constructor(directory: string,
// 					size: number = 5000,
// 					directions: string[] = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"],
// 					suffix: string = ".png") {
// 				super();
// 				var skyGeometry = new THREE.CubeGeometry(size, size, size);

// 				var materialArray = [];
// 				directions.forEach((d) => {
// 					materialArray.push( new THREE.MeshBasicMaterial({
// 						map: THREE.ImageUtils.loadTexture(directory + d + suffix),
// 						side: THREE.BackSide
// 					}));
// 				});
// 				var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
// 				this.object = new THREE.Mesh(skyGeometry, skyMaterial);
// 			}

// 			// fromPNG(folder: path)

// 		}

// 	}

// }