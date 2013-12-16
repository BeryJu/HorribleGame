/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-15 21:20:26
*/

module HG.Sound {

	export class Effect extends HG.Core.EventDispatcher implements HG.Resource.ILoadable {

		name: string;
		gainNode: GainNode;
		destination: HG.Sound.Channel;
		source: AudioBufferSourceNode;
		buffer: AudioBuffer;
		rootContext: AudioContext;

		constructor(ch: HG.Sound.Channel) {
			super(["playing", "stopped", "done"]);
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

		play(): void {
			this.source = this.rootContext.createBufferSource();
			this.source.buffer = this.buffer;
			this.source.connect(this.gainNode);
			this.source.start(0);
			this.dispatch("playing");
		}

		stop(): void {
			this.source.stop(0);
			this.dispatch("stopped");
		}

		volume(gain: number): void {
			this.gainNode.gain.value = gain;
		}

	}

}