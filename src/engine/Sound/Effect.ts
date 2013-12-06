/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 15:50:11
*/

module HG.Sound {

	export class Effect implements HG.Resource.ILoadable {

		name: string;
		gainNode: GainNode;
		destination: HG.Sound.Channel;
		source: AudioBufferSourceNode;
		buffer: AudioBuffer;
		rootContext: AudioContext;

		get gain(): number {
			return this.gainNode.gain.value || 0;
		}

		constructor(ch: HG.Sound.Channel) {
			this.destination = ch;
			this.rootContext = this.destination.rootContext;
			this.gainNode = this.rootContext.createGain();
			this.gainNode.connect(this.rootContext.destination);
		}

		load(data: AudioBuffer): void {
			this.source = this.rootContext.createBufferSource();
			this.buffer = data;
			this.source.buffer = data;
			this.source.connect(this.gainNode);
		}

		recreate(): void {
			this.source = this.rootContext.createBufferSource();
			if (this.buffer !== null) this.source.buffer = this.buffer;
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

		volume(gain: number): void {
			this.gainNode.gain.value = gain;
		}

	}

}