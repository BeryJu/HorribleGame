/// <reference path="MovingEntity.hg.ts" />
/*
* ModelEntity.hg.ts
* Author: BeryJu
*/

module HG {

	export module Entities {

		export class ModelEntity extends MovingEntity {

			object: THREE.Mesh;
			eventsAvailable: string[] = ["loaded"];

			constructor(url?: string) {
				super();
				if (url) this.loadAsync(url);
			}

			onReadyStateChange(req): void {
				if (req.readyState === 4) {
					var loader = new THREE.JSONLoader();
					var result = loader.parse(JSON.parse(req.responseText));
					this.load(result.geometry, result.materials);
				}
			}

			loadAsync(url: string): void {
				var req = new XMLHttpRequest();
				var scope = this;
				req.onreadystatechange = function(req) {
					scope.onReadyStateChange(this);
				};
				req.open("GET", url, true);
				req.send();
			}

			load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void {
				var material = new THREE.MeshFaceMaterial(materials);
				this.object = new THREE.Mesh(geometry, material);
				this.dispatch('loaded');
			}

			frame(delta: number): void {
				super.frame(delta);
			}

		}

	}

}