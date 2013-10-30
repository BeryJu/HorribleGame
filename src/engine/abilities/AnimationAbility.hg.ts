/// <reference path="BaseAbility.hg.ts" />
/*
* AnimationAbility.hg.ts
* Author: BeryJu
*/

module HG {

	export module Abilities {

		export class AnimationAbility extends BaseAbility {

			animOffset: number = 0;
			running: boolean = false;
			duration: number = 1000;
			keyframes: number = 20;
			interpolation: number = this.duration / this.keyframes;
			lastKeyframe: number = 0;
			currentKeyframe: number = 0;
			eventsAvailable: string[] = ["loaded"];

			constructor(path?: string) {
				super();
				if (path) this.loadAsync(path);
			}
			
			checkCompatibility(entity: BaseEntity): boolean {
				return (entity.object instanceof THREE.Mesh);
			}

			loadAsync(path: string): void {
				global.fs.readFile(path, (err, data) => {
					var loader = new THREE.JSONLoader();
					var result = loader.parse(JSON.parse(data));
					this.load(result.geometry, result.materials);
				});
			}

			load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void {
				materials.forEach((m) => {
					m['morphTargets'] = true;
				});
				var material = new THREE.MeshFaceMaterial(materials);
				var oldPosition = this.hostEntity.object.position;
				var oldRotation = this.hostEntity.object.rotation;
				this.hostEntity.object = new THREE.Mesh(geometry, material);
				this.hostEntity.object.position = oldPosition;
				this.hostEntity.object.rotation = oldRotation;
				this.dispatch('loaded');
			}

			frame(delta: number): void {
				super.frame(delta);
				if (this.running === true) {
					var time = new Date().getTime() % this.duration;
					var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
					if (keyframe != this.currentKeyframe ) {
						this.hostEntity.object['morphTargetInfluences'][this.lastKeyframe] = 0;
						this.hostEntity.object['morphTargetInfluences'][this.currentKeyframe] = 1;
						this.hostEntity.object['morphTargetInfluences'][keyframe] = 0;
						this.lastKeyframe = this.currentKeyframe;
						this.currentKeyframe = keyframe;
					}
					this.hostEntity.object['morphTargetInfluences'][keyframe] =
						(time % this.interpolation) / this.interpolation;
					this.hostEntity.object['morphTargetInfluences'][this.lastKeyframe] =
						1 - this.hostEntity.object['morphTargetInfluences'][keyframe];
					this.running = false;
				}
			}

		}

	}

}