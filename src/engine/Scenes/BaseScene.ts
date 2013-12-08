/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-08 22:03:41
*/

module HG.Scenes {

	export class BaseScene {

		scene: Physijs.Scene;
		cameras: HG.Entities.CameraEntity[];
		selectedCamera: number;
		controls: HG.Core.InputHandler;
		color: THREE.Color;
		colorAlpha: number;
		entities: {
			named: {};
			unnamed: HG.Entities.BaseEntity[];
		};

		constructor() {
			this.controls = new HG.Core.InputHandler();
			this.camera = [];
			this.scene = new Physijs.Scene();
			this.entities = {
				named: {},
				unnamed: []
			};
		}

		add(entity: HG.Entities.BaseEntity, nameTag?: string): void {
			this.scene.add(entity.getInternal());
			if (entity instanceof HG.Entities.CameraEntity) {
				this.cameras.push(entity);
			} else if (entity instanceof HG.Entities.BaseEntity) {
				if (nameTag) {
					if (this.entities.named[nameTag.toLowerCase()]) {
						HG.locale.core.errors.duplicateNameTag.f(nameTag).error();
					} else {
						this.entities.named[nameTag.toLowerCase()] = entity;
					}
				} else {
					this.entities.unnamed.push(entity);
				}
			}
		}

		merge(otherScene: HG.Scenes.BaseScene): void {
			// todo
		}

		resize(ratio: number): void {
			this.camera.resize(ratio);
		}

		getAllNamed(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			for (var k in this.entities.named) {
				var v = this.entities.named[k];
				if (v instanceof type) es.push(v);
			}
			return es;
		}

		getAllUnnamed(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			this.entities.unnamed.forEach((e) => {
				if (e instanceof type) es.push(e);
			});
			return es;
		}

		getAll(type: any = HG.Entities.BaseEntity): any[] {
			var es = [];
			es.concat(this.getAllUnnamed(type));
			es.concat(this.getAllNamed(type));
			return es;
		}

		forNamed(callback: (e: any, k: string) => any, type?: any): void {
			if (!type) type = HG.Entities.BaseEntity;
			for (var k in this.entities.named) {
				var ne = this.entities.named[k];
				if (ne instanceof type) callback(ne, k);
			}
		}

		forUnamed(callback: (e: any) => any, type?: any): void {
			if (!type) type = HG.Entities.BaseEntity;
			this.entities.unnamed.forEach((e) => {
				if (e instanceof type) callback(e);
			});
		}

		forAll(callback: (e: any) => any, type: any = HG.Entities.BaseEntity): void {
			this.forNamed(callback, type);
			this.forUnamed(callback, type);
		}

		getInternal(): Physijs.Scene {
			return this.scene;
		}

		getCamera(): THREE.PerspectiveCamera {
			return this.cameras[this.selectedCamera].getInternal() || null;
		}

		get<T>(nameTag: string): T {
			nameTag = nameTag.toLowerCase();
			return <T> this.entities.named[nameTag] || null;
		}

		frame(delta: number): void {
			this.controls.frame(delta);
			this.cameras[this.selectedCamera].frame(delta);
			this.forNamed((e) => e.frame(delta));
		}

	}

}