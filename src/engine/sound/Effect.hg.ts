/* 
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-09 16:15:25
*/
/// <reference path="../EventDispatcher.ts" />
module HG {

	export module Sound {

		export class Effect {

			name: string;
			gainNode: GainNode;
			destination: HG.Sound.Channel;
			source: AudioBufferSourceNode;

			get gain(): number {
				return this.gainNode.gain.value || 0;
			}

			constructor(ch: HG.Sound.Channel) {
				this.destination = ch;
				this.gainNode = this.destination.context.createGain();
				this.gainNode.connect(this.destination.context.destination);
			}

			load(path: string): void {
				global.fs.readFile(path, (err, data) => {
					this.source = this.destination.context.createBufferSource();
					this.destination.context.decodeAudioData(data, (buffer) => {
						this.source.buffer = buffer;
					}, () => {});
					this.source.connect(this.gainNode);
				});
			}

			play(): void {
				if (this.source)
					this.source.start(0);
			}

			volume(gain: number): void {
				if (this.gainNode)
					this.gainNode.gain.value = gain;
			}

		}

	}

}