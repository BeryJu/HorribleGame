/*
* @Author: BeryJu
* @Date:   2013-12-06 16:02:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-06 16:17:57
*/

module HG.Entities {

	export class SpriteEntity extends HG.Entities.BaseEntity {

		object: THREE.Sprite;

		constructor(canvas: HTMLCanvasElement,
			alignment: THREE.Vector2 = THREE.SpriteAlignment.topLeft) {
			super();
			var texture = new THREE.Texture(canvas);
			texture.needsUpdate = true;

			var spriteMaterial = new THREE.SpriteMaterial({
				map: texture,
				useScreenCoordinates: false,
				alignment: alignment
			});
			var sprite = new THREE.Sprite(spriteMaterial);
		}

	}

}