module HG {

	export module Entities {

		export class AnimatedEntity extends HG.Entity {

			animOffset: number = 0;
			walking: boolean = false;
			duration: number = 1000;
			keyframes: number = 20;
			interpolation: number = this.duration / this.keyframes;
			lastKeyframe: number = 0;
			currentKeyframe: number = 0;
			object: THREE.Mesh;

			load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void {
				for (var i = 0; i < materials.length; i++) {
					materials[i]['morphTargets'] = true;
				}
				var material = new THREE.MeshFaceMaterial(materials);
				this.object = new THREE.Mesh(geometry, material);
			}

			frame(delta: number): void {
				if (this.walking === true) {
					var time = new Date().getTime() % this.duration;
					var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
					if (keyframe != this.currentKeyframe ) {
						this.object.morphTargetInfluences[this.lastKeyframe] = 0;
						this.object.morphTargetInfluences[this.currentKeyframe] = 1;
						this.object.morphTargetInfluences[keyframe] = 0;
						this.lastKeyframe = this.currentKeyframe;
						this.currentKeyframe = keyframe;
					}
					this.object.morphTargetInfluences[keyframe] =
						(time % this.interpolation) / this.interpolation;
					this.object.morphTargetInfluences[this.lastKeyframe] =
						1 - this.object.morphTargetInfluences[keyframe];
				}
			}

		}

	}

}