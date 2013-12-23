/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 12:35:30
*/

module HG.Sound {

	export class Mixer {

		channels: HG.Core.Collection<HG.Sound.Channel>;
		gainNode: GainNode;
		context: AudioContext;

		constructor() {
			this.context = new AudioContext();
			this.channels = new HG.Core.Collection<HG.Sound.Channel>();
		}

		get gain(): number {
			return this.gainNode.gain.value || 0;
		}

		channel(name: string): HG.Sound.Channel {
			if (name in this.channels) {
				return this.channels.get(name);
			} else {
				return null;
			}
		}

		volume(gain: number): void {
			if (this.gainNode)
				this.gainNode.gain.value = gain;
		}

		addChannel(ch: HG.Sound.Channel): void {
			ch.rootContext = this.context;
			this.channels.push(ch);
		}

	}

}