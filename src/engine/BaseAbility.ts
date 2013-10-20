/// <reference path="EventDispatcher.ts" />
/*
* BaseAbility.ts
* Author: BeryJu
*/

module HG {
	
	export class BaseAbility extends EventDispatcher {

		hostEntity: BaseEntity;

		setHost(entity: BaseEntity): void {
			this.hostEntity = entity;
		}

		checkCompatibility(entity: BaseEntity): boolean { return true; }

		frame(delta: number): void {}

	}

}