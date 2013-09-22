/// <reference path="lib/three.d.ts"/>

module HG {
	export interface IRawLevel {
		entities: Array[];
		playerPosition: number[];
	}

	export class Level {
		entities: HG.Entity[];

		load(Raw: HG.IRawLevel): HG.Level {
			return this;
		}

		loadAsync(Url: string): void {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(req) {
				if (this.readyState === 4) {
					console.log(this.responseText);
				}
			}
			req.open("GET", Url, true);
			req.send();
		}

		create(Seed?: number): HG.Level {
			return this;
		}
	}
}