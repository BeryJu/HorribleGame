/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:11:35
*/

module HG.Abilities {

	export class BaseAbility extends HG.Core.EventDispatcher {

		hostEntity: HG.Entities.BaseEntity;

		setHost(entity: HG.Entities.BaseEntity): void {
			this.hostEntity = entity;
		}

		checkCompatibility(entity: HG.Entities.BaseEntity): boolean { return true; }

		frame(delta: number): void { return; }

	}

}