/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-25 02:13:19
*/

module HG.Abilities {

	export class AnimationAbility extends HG.Abilities.Ability {

		animOffset: number = 0;
		running: boolean = false;
		duration: number = 1000;
		keyframes: number = 20;
		interpolation: number = this.duration / this.keyframes;
		lastKeyframe: number = 0;
		currentKeyframe: number = 0;
		events: string[] = ["loaded"];

		constructor(options: {
			offset: number;
			duration: number;
			keyframes: number;
		}) {
			super();
			this.animOffset = 0 || options.offset;
			this.duration = 1000 || options.duration;
			this.keyframes = 20 || options.keyframes;
		}

		run(): void {
			this.running = true;
		}

		checkCompatibility(entity: HG.Entities.Entity): boolean {
			return (entity instanceof HG.Entities.MeshEntity);
		}

		frame(delta: number): void {
			super.frame(delta);
			if (this.running === true) {
				var time = new Date().getTime() % this.duration;
				var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
				if (keyframe !== this.currentKeyframe ) {
					this.host.object["morphTargetInfluences"][this.lastKeyframe] = 0;
					this.host.object["morphTargetInfluences"][this.currentKeyframe] = 1;
					this.host.object["morphTargetInfluences"][keyframe] = 0;
					this.lastKeyframe = this.currentKeyframe;
					this.currentKeyframe = keyframe;
				}
				this.host.object["morphTargetInfluences"][keyframe] =
					(time % this.interpolation) / this.interpolation;
				this.host.object["morphTargetInfluences"][this.lastKeyframe] =
					1 - this.host.object["morphTargetInfluences"][keyframe];
				this.running = false;
			}
		}

	}

}