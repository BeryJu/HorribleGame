/*
* @Author: BeryJu
* @Date:   2013-11-24 11:08:10
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-13 15:45:10
*/

module HG.Abilities {

	export class AudioAbility extends HG.Abilities.BaseAbility {

		audioEffect: HG.Sound.Effect;

		constructor(options: {
			effect: HG.Sound.Effect;
		}) {
			super();
			this.audioEffect = options.effect;
			if (this.audioEffect === null) {
				HG.locale.errors.nullReferenceError.error();
			}
		}

		play(): void {
			this.audioEffect.play();
		}

	}

}