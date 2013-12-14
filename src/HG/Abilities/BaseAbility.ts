/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 11:33:38
*/

module HG.Abilities {

	export class BaseAbility extends HG.Core.EventDispatcher {

		hosts: HG.Entities.BaseEntity[] = [];

		setHost(entity: HG.Entities.BaseEntity): void {
			console.log(entity["constructor"]["name"] + " got " + this["constructor"]["name"]);
			this.hosts.push(entity);
		}

		checkCompatibility(entity: HG.Entities.BaseEntity): boolean { return true; }

		frame(delta: number): void { return; }

	}

}