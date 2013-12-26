/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 13:52:12
*/

module HG.Entities {

	export class VideoEntity extends HG.Entities.Entity {

		domElement: HTMLVideoElement;
		videoTexture: THREE.Texture;
		videoImageContext: CanvasRenderingContext2D;

		constructor(domElement: HTMLVideoElement) {
			super();
			var size = new THREE.Vector2(domElement.videoHeight, domElement.videoWidth);
			this.domElement = domElement;
			var videoImage = document.createElement("canvas");
			videoImage.width = size.x;
			videoImage.height = size.y;

			this.videoImageContext = videoImage.getContext("2d");
						// background color if no video present
			this.videoImageContext.fillStyle = "#000000";
			this.videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

			this.videoTexture = new THREE.Texture(videoImage);
			this.videoTexture.minFilter = THREE.LinearFilter;
			this.videoTexture.magFilter = THREE.LinearFilter;

			var movieMaterial = new THREE.MeshBasicMaterial({
				map: this.videoTexture,
				overdraw: true,
				side: THREE.DoubleSide
			});
			// the geometry on which the movie will be displayed;
			// 		movie image will be scaled to fit these dimensions.
			var movieGeometry = new THREE.PlaneGeometry(size.x, size.y, 4, 4);
			this.object = new THREE.Mesh(movieGeometry, movieMaterial);
		}

		play(): void {
			this.domElement.play();
		}

		pause(): void {
			this.domElement.pause();
		}

		stop(): void {
			this.domElement.pause();
			this.domElement.currentTime = 0;
		}

		rewind(): void {
			this.domElement.currentTime = 0;
		}

		frame(delta: number): void {
			if (this.domElement.readyState === this.domElement.HAVE_ENOUGH_DATA) {
				this.videoImageContext.drawImage(this.domElement, 0, 0);
				this.videoTexture.needsUpdate = true;
			}
		}

	}

}