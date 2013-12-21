/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 10:19:46
*/

module HG.Abilities {

	export class ScriptExecuteAbility extends HG.Abilities.Ability {

		events: string[] = ["loaded"];

		constructor() {
			super();

		}

		checkCompatibility(entity: HG.Entities.Entity): boolean {
			return (entity instanceof HG.Entities.MeshEntity);
		}

		frame(delta: number): void {
			super.frame(delta);
		}

	}

}