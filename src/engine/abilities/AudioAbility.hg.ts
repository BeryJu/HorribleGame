/// <reference path="BaseAbility.hg.ts" />
/*
* AudioAbility.hg.ts
* Author: BeryJu
*/

module HG {

	export module Abilities {

		export class AudioAbility extends BaseAbility {

			eventsAvailable: string[] = ["loaded"];

			constructor(url?: string) {
				super();
				if (url) this.loadAsync(url);
			}

			checkCompatibility(entity: BaseEntity): boolean {
				return (entity.object instanceof THREE.Mesh);
			}
			
			loadAsync(url: string): void {
				var req = new XMLHttpRequest();
				req.onreadystatechange = (ev) => {
					if (req.readyState === 4) {
						var loader = new THREE.JSONLoader();
						var result = loader.parse(JSON.parse(req.responseText));
						this.load(result.geometry, result.materials);
					}
				};
				req.open("GET", url, true);
				req.send();
			}

			load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void {

				// this.hostEntity.object = new THREE.Mesh(geometry, material);
				this.dispatch('loaded');
			}

			frame(delta: number): void {
				super.frame(delta);
			}

		}

	}

}