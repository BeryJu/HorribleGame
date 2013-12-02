/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 17:28:55
*/

module HG.Sound {

	export class Mixer {

		channels: {} = {};
		gainNode: GainNode;
		context: AudioContext;

		get gain(): number {
			return this.gainNode.gain.value || 0;
		}

		channel(name: string): HG.Sound.Channel {
			if (name in this.channels) {
				return this.channels[name];
			} else {
				return null;
			}
		}

		constructor() {
			this.context = new AudioContext();
		}

		volume(gain: number): void {
			if (this.gainNode)
				this.gainNode.gain.value = gain;
		}

		addChannel(ch: HG.Sound.Channel): void {
			ch.rootContext = this.context;
			this.channels[ch.name] = ch;
		}

	}

}