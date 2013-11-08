/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-06 15:08:35
*/
/// <reference path="BaseAbility.hg.ts" />

module HG {

	export module Abilities {

		export class AudioAbility extends BaseAbility {

			eventsAvailable: string[] = ["loaded"];

			checkCompatibility(entity: BaseEntity): boolean {
				return (entity.object instanceof THREE.Mesh);
			}
			
			fromMP3(path: string): void {
				global.fs.readFile(path, (err, data) => {

				});
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