/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 02:33:21
*/

module HG.Abilities {

	export class Ability extends HG.Core.EventDispatcher {

		host: HG.Entities.Entity;

		setHost(entity: HG.Entities.Entity): void {
			this.host = entity;
		}

		checkCompatibility(entity: HG.Entities.Entity): boolean { return true; }

		frame(delta: number): void { return; }

	}

}