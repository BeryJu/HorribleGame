/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 15:52:36
*/

module HG.Sound {

	export class Channel extends HG.Core.EventDispatcher {

		name: string;
		rootContext: AudioContext;
		gainNode: GainNode;
		private children: HG.Sound.Effect[];

		get gain(): number {
			return this.gainNode.gain.value || 0;
		}

		constructor(name: string) {
			super(["volumeChange"]);
			this.name = name;
		}

		effect(): HG.Sound.Effect {
			var fx = new HG.Sound.Effect(this);
			this.children.push(fx);
			return fx;
		}

		volume(gain: number): void {
			if (this.gainNode) {
				this.gainNode.gain.value = gain;
				if (this.children.length > 0)
					this.children.forEach((child) => child.volume(gain));
			}
		}

	}

}