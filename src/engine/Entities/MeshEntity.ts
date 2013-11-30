/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 20:58:53
*/

module HG.Entities {

	export class MeshEntity extends HG.Entities.BaseEntity implements HG.Resource.ILoadable {

		object: THREE.Mesh;
		events: string[] = ["loaded"];

		constructor(geo?: THREE.Geometry, mat?: THREE.MeshBasicMaterial) {
			super();
			if (geo && mat) this.object = new THREE.Mesh(geo, mat);
		}

		load(data: {}): void {
			this.object = new THREE.Mesh(data["geometry"], data["material"]);
			this.dispatch("loaded", data["geometry"], data["material"]);
		}

	}

}