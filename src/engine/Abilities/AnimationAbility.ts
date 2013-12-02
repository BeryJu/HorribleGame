/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:11:26
*/

module HG.Abilities {

	export class AnimationAbility extends HG.Abilities.BaseAbility {

		animOffset: number = 0;
		running: boolean = false;
		duration: number = 1000;
		keyframes: number = 20;
		interpolation: number = this.duration / this.keyframes;
		lastKeyframe: number = 0;
		currentKeyframe: number = 0;
		events: string[] = ["loaded"];

		setHost(entity: HG.Entities.BaseEntity): void {
			this.hostEntity = entity;
			entity.on("loaded", (g, m) => {
				g = <THREE.Geometry> g;
				m = <THREE.MeshLambertMaterial[]> m;
				this.load(g, m);
			});
		}

		checkCompatibility(entity: HG.Entities.BaseEntity): boolean {
			return (entity instanceof HG.Entities.MeshEntity);
		}

		load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void {
			materials.each((material) => {
				material.morphTargets = true;
			});
			var material = new THREE.MeshFaceMaterial(materials);
			var oldPosition = this.hostEntity.object.position;
			var oldRotation = this.hostEntity.object.rotation;
			this.hostEntity.object = new THREE.Mesh(geometry, material);
			this.hostEntity.object.position = oldPosition;
			this.hostEntity.object.rotation = oldRotation;
			this.dispatch("loaded");
		}

		frame(delta: number): void {
			super.frame(delta);
			if (this.running === true) {
				var time = new Date().getTime() % this.duration;
				var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
				if (keyframe !== this.currentKeyframe ) {
					this.hostEntity.object["morphTargetInfluences"][this.lastKeyframe] = 0;
					this.hostEntity.object["morphTargetInfluences"][this.currentKeyframe] = 1;
					this.hostEntity.object["morphTargetInfluences"][keyframe] = 0;
					this.lastKeyframe = this.currentKeyframe;
					this.currentKeyframe = keyframe;
				}
				this.hostEntity.object["morphTargetInfluences"][keyframe] =
					(time % this.interpolation) / this.interpolation;
				this.hostEntity.object["morphTargetInfluences"][this.lastKeyframe] =
					1 - this.hostEntity.object["morphTargetInfluences"][keyframe];
				this.running = false;
			}
		}

	}

}