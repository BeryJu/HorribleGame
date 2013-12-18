/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-18 21:16:24
*/

module HG.Scenes {

	export class BaseScene {

		scene: Physijs.Scene;
		cameras: HG.Scenes.EntityCollection<HG.Entities.CameraEntity>;
		entities: HG.Scenes.EntityCollection<HG.Entities.BaseEntity>;
		controls: HG.Core.InputHandler;
		selectedCamera: string;
		color: THREE.Color;
		colorAlpha: number;
		startTime: number;

		constructor() {
			this.startTime = Date.now();
			this.controls = new HG.Core.InputHandler();
			this.selectedCamera = "";
			this.scene = new Physijs.Scene();
			this.entities = new HG.Scenes.EntityCollection<HG.Entities.BaseEntity>();
			this.cameras = new HG.Scenes.EntityCollection<HG.Entities.CameraEntity>();
		}

		add(entity: HG.Entities.BaseEntity): void {
			this.scene.add(entity.getInternal());
			if (entity instanceof HG.Entities.CameraEntity) {
				this.cameras.add(<HG.Entities.CameraEntity> entity);
			} else if (entity instanceof HG.Entities.BaseEntity) {
				this.entities.add(entity);
			}
		}

		merge(otherScene: HG.Scenes.BaseScene): HG.Scenes.BaseScene {
			var newScene = new HG.Scenes.BaseScene();
			newScene.entities = this.entities.merge(otherScene.entities);
			newScene.cameras = this.cameras.merge(otherScene.cameras);
			newScene.controls = this.controls.merge(otherScene.controls);
			newScene.color = this.color;
			newScene.colorAlpha = this.colorAlpha;
			newScene.selectedCamera = this.selectedCamera;
			return newScene;
		}

		onResize(ratio: number): void {
			this.cameras.forNamed((e) => (<HG.Entities.CameraEntity> e).resize(ratio));
		}

		camera(name: string): boolean {
			var has = this.cameras.has(name);
			if (has !== null) {
				this.selectedCamera = name;
				return true;
			} else {
				return false;
			}
		}

		getInternal(): Physijs.Scene {
			return this.scene;
		}

		getCamera(): THREE.PerspectiveCamera {
			return (<THREE.PerspectiveCamera>
				this.cameras.get(this.selectedCamera).getInternal()) || null;
		}

		frame(delta: number): void {
			this.controls.frame(delta);
			this.entities.forNamed((e) => e.frame(delta));
			this.entities.forEach((e) => {
				if (e.object.material &&
					e.object.material.uniforms &&
					e.object.material.uniforms["time"]) {
					var now = Date.now();
					e.object.material.uniforms["time"].value = .00025 * (now - this.startTime);
				}
			});
			this.cameras.forNamed((e) => e.frame(delta));
		}

	}

}