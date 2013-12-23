/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-22 12:28:30
*/

module HG.Scenes {

	export class Scene {

		scene: Physijs.Scene;
		cameras: HG.Core.Collection<HG.Entities.CameraEntity>;
		entities: HG.Core.Collection<HG.Entities.Entity>;
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
			this.entities = new HG.Core.Collection<HG.Entities.Entity>();
			this.cameras = new HG.Core.Collection<HG.Entities.CameraEntity>();
		}

		push(entity: HG.Entities.Entity): void {
			this.scene.add(entity.getInternal());
			if (entity instanceof HG.Entities.CameraEntity) {
				this.cameras.push(<HG.Entities.CameraEntity> entity);
			} else if (entity instanceof HG.Entities.Entity) {
				this.entities.push(entity);
			}
		}

		concat(otherScene: HG.Scenes.Scene): HG.Scenes.Scene {
			var newScene = new HG.Scenes.Scene();
			newScene.entities = this.entities.concat(otherScene.entities);
			newScene.cameras = this.cameras.concat(otherScene.cameras);
			newScene.controls = this.controls.concat(otherScene.controls);
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