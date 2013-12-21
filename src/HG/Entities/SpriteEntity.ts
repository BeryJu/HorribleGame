/*
* @Author: BeryJu
* @Date:   2013-12-06 16:02:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 10:19:20
*/

module HG.Entities {

	export class SpriteEntity extends HG.Entities.Entity {

		object: THREE.Sprite;
		alignment: THREE.Vector2;

		constructor(canvas?: HTMLCanvasElement,
			alignment: THREE.Vector2 = new THREE.Vector2(1, -1)) {
			super();
			this.alignment = alignment;
			if (typeof canvas !== "undefined") {
				console.log("wat");
				var texture = new THREE.Texture(canvas);
				texture.needsUpdate = true;

				var spriteMaterial = new THREE.SpriteMaterial({
					map: texture,
					useScreenCoordinates: false,
					alignment: this.alignment
				});
				this.object = new THREE.Sprite(spriteMaterial);
			}
		}

		load(texture: THREE.Texture): void {
			var spriteMaterial = new THREE.SpriteMaterial({
				map: texture,
				useScreenCoordinates: false,
				alignment: this.alignment
			});
			this.object = new THREE.Sprite(spriteMaterial);
		}

	}

}