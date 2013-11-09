/* 
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-09 16:15:12
*/
/// <reference path="../EventDispatcher.ts" />
module HG {

	export module Sound {

		export class Channel {

			name: string;
			rootContext: AudioContext;
			context: AudioContext;
			gainNode: GainNode;

			constructor(mx: HG.Sound.Mixer) {
				this.rootContext = mx.context;
			}

			volume(gain: number): void {
				if (this.gainNode)
					this.gainNode.gain.value = gain;
			}

		}

	}

}