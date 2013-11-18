/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:37
*/
/// <reference path="../EventDispatcher.ts" />

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