/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 14:31:45
*/

module HG.Entities {

	export class TextEntity extends HG.Entities.Entity {

		object: THREE.Mesh;
		texture: THREE.Texture;
		_text: string;
		_font: string;
		_fillStyle: string;
		context: CanvasRenderingContext2D;

		set text (v: string) {
			this._text = v;
			this.reDraw();
		}

		set font (v: string) {
			this._font = v;
			this.reDraw();
		}

		set fillStyle (v: string) {
			this._fillStyle = v;
			this.reDraw();
		}

		constructor(text?: string) {
			super();
			var canvas = document.createElement("canvas");
			this.texture = new THREE.Texture(canvas);
			this.texture.needsUpdate = true;
			this.context = canvas.getContext("2d");
			this._text = text;
			this._fillStyle = "rgba(255,0,0,1)";
			this._font = "14px Arial";
			this.reDraw();
			var material = new THREE.MeshBasicMaterial({
				map: this.texture,
				side:THREE.DoubleSide
			});
			material.transparent = true;
			var geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
			this.object = new THREE.Mesh(geometry, material);
		}

		reDraw(): void {
			var size = new THREE.Vector2(this.context.canvas.width, this.context.canvas.height);
			this.context.clearRect(0, 0, size.x, size.y);
			this.context.font = this._font;
			this.context.fillStyle = this._fillStyle;
			this.context.fillText(this._text, 0, 0);
		}

	}

}