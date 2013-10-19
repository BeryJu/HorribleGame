/// <reference path="../BaseAbility.ts" />
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

			constructor(url?: string) {
				super();
				if (url) this.loadAsync(url);
			}
			
			checkCompatibility(entity: BaseEntity): boolean {
				return (entity.object instanceof THREE.Mesh);
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
				for (var i = 0; i < materials.length; i++) {
					materials[i]['morphTargets'] = true;
				}
				var material = new THREE.MeshFaceMaterial(materials);
				this.hostEntity.object = new THREE.Mesh(geometry, material);
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
					// this.running = false;
				}
			}

		}

	}

}