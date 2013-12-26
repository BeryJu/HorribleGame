/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 18:20:28
*/

module HG.Entities {

	export class MeshEntity extends HG.Entities.Entity implements HG.Resource.ILoadable {

		object: THREE.Mesh;
		events: string[] = ["loaded"];

		constructor(geometry?: THREE.Geometry, material?: THREE.Material) {
			super();
			if (geometry && material) {
				this.object = new THREE.Mesh(geometry, material);
			}
		}

		load(data: {
			material: any;
			geometry: THREE.Geometry;
		}): void {
			var material = data.material;
			if (Array.isArray(material)) {
				material.forEach((material) => {
					material.morphTargets = true;
				});
				var meshMaterial = new THREE.MeshFaceMaterial(material);
				this.object = new THREE.Mesh(data.geometry, meshMaterial);
			} else {
				this.object = new THREE.Mesh(data.geometry, material);
			}
			this.dispatch("loaded", data.geometry, data.material);
		}

	}

}