/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-20 17:30:26
*/

module HG {
	
	export class Renderer extends THREE.WebGLRenderer {

		dirty: boolean = true;

		constructor(params: {}) {
			super(params);
		}

		draw(scene: HG.BaseScene, camera: HG.Entities.CameraEntity): void {
			if (this.dirty === true) {
				super.render(scene.getInternal(), 
					<THREE.PerspectiveCamera> camera.getInternal());
			}
		}

	}

}