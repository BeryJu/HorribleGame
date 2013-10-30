/// <reference path="../GameComponent.ts" />
/// <reference path="../abilities/BaseAbility.hg.ts" />
/*
* MeshEntity.ts
* Author: BeryJu
*/

module HG {

	export module Entities {


		export class MeshEntity extends BaseEntity {
			_: {};
			abilities: HG.BaseAbility[] = [];
			object: THREE.Mesh;
			positionOffset: THREE.Vector3 = new THREE.Vector3;

			constructor(geo?: THREE.Geometry, mat?: THREE.MeshBasicMaterial) {
				super();
				if (geo && mat) this.object = new THREE.Mesh(geo, mat);
			}

		}
		
	}

}