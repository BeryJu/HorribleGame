/* 
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:35
*/
/// <reference path="../EventDispatcher.ts" />
module HG {

	export module Sound {

		export class Mixer {

			channels: {} = {};
			gainNode: GainNode;
			context: AudioContext;

			get gain(): number {
				return this.gainNode.gain.value || 0;
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

}