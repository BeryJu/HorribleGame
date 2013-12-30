/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 22:20:59
*/

module HG.Core {

	export class Scene {

		scene: Physijs.Scene;
		cameras: HG.Core.Collection<HG.Entities.CameraEntity>;
		entities: HG.Core.Collection<HG.Entities.Entity>;
		controls: HG.Input.Handler;
		selectedCamera: string;
		color: THREE.Color;
		colorAlpha: number;
		startTime: number;
		unnamedCount: number;

		set fog(v: THREE.Fog) {
			this.scene.fog = v;
		}

		constructor() {
			this.startTime = Date.now();
			this.controls = new HG.Input.Handler();
			this.selectedCamera = "";
			this.unnamedCount = 0;
			this.scene = new Physijs.Scene();
			this.entities = new HG.Core.Collection<HG.Entities.Entity>();
			this.cameras = new HG.Core.Collection<HG.Entities.CameraEntity>();
		}

		push(entity: HG.Entities.Entity): void {
			if (!entity.name) entity.name = "unnamed" + (this.unnamedCount++);
			if (entity instanceof HG.Entities.CameraEntity) {
				HG.log("[Scene] Added Camera " + entity.name);
				this.cameras.push(<HG.Entities.CameraEntity> entity);
			} else if (entity instanceof HG.Entities.Entity) {
				HG.log("[Scene] Added Entity " + entity.name);
				this.entities.push(entity);
				this.scene.add(entity.getInternal());
			}
		}

		concat(otherScene: HG.Core.Scene): HG.Core.Scene {
			var newScene = new HG.Core.Scene();
			newScene.entities = this.entities.concat(otherScene.entities);
			newScene.cameras = this.cameras.concat(otherScene.cameras);
			// newScene.controls = this.controls.concat(otherScene.controls);
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
			this.cameras.forNamed((e) => e.frame(delta));
			this.entities.forNamed((e) => e.frame(delta));
			this.entities.forEach((e) => {
				if (e["object"]["material"] && e["object"]["material"]["uniforms"]) {
					if (e["object"]["material"]["uniforms"]["time"])
						e["object"]["material"]["uniforms"]["time"].value = .00025 * (Date.now() - this.startTime);
				}
			});
		}

	}

}