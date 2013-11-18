/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:30
*/
/// <reference path="../abilities/BaseAbility.ts" />

module HG {

	export module Entities {

		export class MeshEntity extends BaseEntity {

			abilities: HG.BaseAbility[] = [];
			object: THREE.Mesh;
			positionOffset: THREE.Vector3 = new THREE.Vector3;

			constructor(geo?: THREE.Geometry, mat?: THREE.MeshBasicMaterial) {
				super();
				if (geo && mat) this.object = new THREE.Mesh(geo, mat);
			}

			from(data: HG.Loaders.LoadData): void {
				data.loader.on('loaded', () => {

				});
			}

		}
		
	}

}