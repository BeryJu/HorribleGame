/*
* AudioEntity.hg.ts
* Author: BeryJu
*/
module HG {

	export module Entities {

		export class AudioEntity extends HG.BaseEntity {

			eventsAvailable: string[] = ["loaded"];
			buffer: any;

			constructor(url?: string) {
				super();
				if (url) this.loadAsync(url);
			}

			onReadyStateChange(req): void {
				if (req.readyState === 4) {
					var scope = this;
					// context.decodeAudioData(req.response, function(buffer) {
					// 	scope.load(buffer);
					// });
				}
			}

			play(): void {

			}

			pause(): void {

			}

			stop(): void {

			}

			setLoop(): void {

			}

			getLength(): number {
				return 0;
			}

			setPosition(): void {

			}

			loadAsync(url: string): void {
				var req = new XMLHttpRequest();
				var scope = this;
				req.responseType = 'arraybuffer';
				req.onreadystatechange = function(req) {
					scope.onReadyStateChange(this);
				};
				req.open("GET", url, true);
				req.send();
			}

			load(buffer): void {
				this.buffer = buffer;
				this.dispatch('loaded');
			}

			frame(delta: number): void {
				super.frame(delta);
			}

		}

	}

}