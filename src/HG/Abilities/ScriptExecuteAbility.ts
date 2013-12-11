/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-09 14:05:30
*/

module HG.Abilities {

	export class ScriptExecuteAbility extends HG.Abilities.BaseAbility {

		events: string[] = ["loaded"];

		constructor() {
			super();

		}

		checkCompatibility(entity: HG.Entities.BaseEntity): boolean {
			return (entity instanceof HG.Entities.MeshEntity);
		}

		frame(delta: number): void {
			super.frame(delta);
		}

	}

}