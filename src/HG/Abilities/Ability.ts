/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-25 02:12:15
*/

module HG.Abilities {

	export class Ability extends HG.Core.EventDispatcher {

		host: HG.Entities.Entity;

		setHost(entity: HG.Entities.Entity): void {
			console.log(entity["constructor"]["name"] + " got " + this["constructor"]["name"]);
			this.host = entity;
		}

		checkCompatibility(entity: HG.Entities.Entity): boolean { return true; }

		frame(delta: number): void { return; }

	}

}