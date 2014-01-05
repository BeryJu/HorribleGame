/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2014-01-04 20:21:24
*/

module HG.Entities {

	export class TextEntity extends HG.Entities.Entity {

		object: THREE.Mesh;
		_text: string;
		_font: string;
		_size: number;
		_color: number;

		_textSize: THREE.Vector2;

		set text (v: string) {
			this._text = v;
			this.reDraw();
		}

		set font (v: string) {
			this._font = v;
			this.reDraw();
		}

		set fontSize (v: number) {
			this._size = v;
			this.reDraw();
		}

		set color (v: number) {
			this._color = v;
			this.reDraw();
		}

		get size (): THREE.Vector2 {
			return this._textSize;
		}

		constructor(text?: string) {
			super();
			this._text = text;
			this._color = 0x000000;
			this._font = "droid sans";
			this.reDraw();
		}

		reDraw(): void {
			var material = new THREE.MeshFaceMaterial([
				new THREE.MeshBasicMaterial({
					color: this._color
				})
			]);
			var geometry = new THREE.TextGeometry(this._text, {
				size: this._size,
				height: 4,
				material: 0,
				font: this._font
			});
			this.object = new THREE.Mesh(geometry, material);
			geometry.computeBoundingBox();
			this._textSize = new THREE.Vector2(
				geometry.boundingBox.max.x - geometry.boundingBox.min.x,
				geometry.boundingBox.max.y - geometry.boundingBox.min.y
			);
		}

	}

}