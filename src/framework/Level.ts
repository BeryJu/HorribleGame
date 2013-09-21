/// <reference path="lib/three.d.ts"/>

module HG {
	export interface IRawLevel {
		Entities: Array[];
		PlayerPosition: number[];
	}

	export class Level {
		Entities: HG.Entity[];

		Load(Raw: HG.IRawLevel):HG.Level {
			return this;
		}

		LoadAsync(Url: string):void {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function(req) {
				if (this.readyState === 4) {
					console.log(this.responseText);
				}
			}
			req.open("GET", Url, true);
			req.send();
		}

		Create(Seed?: number):HG.Level {
			return this;
		}
	}
}