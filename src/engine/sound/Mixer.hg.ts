/* 
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-09 16:15:10
*/
/// <reference path="../EventDispatcher.ts" />
module HG {

	export module Sound {

		export class Mixer {

			channels: HG.Sound.Channel[];
			gainNode: GainNode;
			context: AudioContext;

			get gain(): number {
				return this.gainNode.gain.value || 0;
			}

			constructor() {

			}

			volume(gain: number): void {
				if (this.gainNode)
					this.gainNode.gain.value = gain;
			}

			addChannel(ch: HG.Sound.Channel): void {
				this.channels.push(ch);
			}

		}

	}

}