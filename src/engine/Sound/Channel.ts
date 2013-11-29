/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:43:51
*/

module HG.Sound {

	export class Channel extends HG.Core.EventDispatcher {

		name: string;
		rootContext: AudioContext;
		gainNode: GainNode;
		eventsAvailable: string[] = ['volumeChange'];

		get gain(): number {
			return this.gainNode.gain.value || 0;
		}

		constructor(name: string) {
			super();
			this.name = name;
		}

		volume(gain: number): void {
			if (this.gainNode) {
				this.gainNode.gain.value = gain;
				this.dispatch("volumeChange", gain);
			}
		}

	}

}