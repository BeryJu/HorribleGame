/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:21:16
*/

module HG.Entities {

	export class MeshEntity extends HG.Entities.BaseEntity implements HG.Resource.ILoadable {

		object: THREE.Mesh;
		eventsAvailable: string[] = ["loaded"];

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