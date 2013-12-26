/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 13:10:17
*/

module HG.Entities {

	export class VideoEntity extends HG.Entities.Entity {

		domElement: HTMLVideoElement;

		constructor(domElement: HTMLVideoElement, size: THREE.Vector2) {
			super();
			this.domElement = domElement;
			var videoImage = document.createElement("canvas");
			videoImage.width = size.x;
			videoImage.height = size.y;

			var videoImageContext = videoImage.getContext("2d");
						// background color if no video present
			videoImageContext.fillStyle = "#000000";
			videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

			var videoTexture = new THREE.Texture(videoImage);
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;

			var movieMaterial = new THREE.MeshBasicMaterial({
				map: videoTexture,
				overdraw: true,
				side:THREE.DoubleSide
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

	}

}