/* 
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-19 15:32:03
*/
/// <reference path="../EventDispatcher.ts" />
module HG {

	export module Sound {

		export class Effect implements HG.Resource.ILoadable {

			name: string;
			gainNode: GainNode;
			destination: HG.Sound.Channel;
			source: AudioBufferSourceNode;
			rootContext: AudioContext;

			get gain(): number {
				return this.gainNode.gain.value || 0;
			}

			constructor(ch: HG.Sound.Channel) {
				this.destination = ch;
				this.destination.on('volumeChange', this.volume);
				this.rootContext = this.destination.rootContext
				this.gainNode = this.rootContext.createGain();
				this.gainNode.connect(this.rootContext.destination);
			}

			load(data: AudioBuffer): void {
				this.source = this.rootContext.createBufferSource();
				this.source.buffer = data;
				this.source.connect(this.gainNode);
			}

			play(): void {
				if (this.source)
					this.source.start(0);
			}

			stop(): void {
				if (this.source)
					this.source.stop(0);
			}

			private volume(gain: number): void {
				if (this.gainNode)
					this.gainNode.gain.value = gain;
			}

		}

	}

}