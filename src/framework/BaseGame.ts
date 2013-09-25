///<reference path="EventDispatcher" />

module HG {

	export class BaseGame extends EventDispatcher{ 
		_: {} = {};
		renderer: THREE.WebGLRenderer;
		camera: THREE.PerspectiveCamera;
		isRunning: boolean = false;
		scene: HG.Scene = new HG.Scene();
		controls: HG.InputHandler = new HG.InputHandler();
		fpsCounter: HG.FPSCounter = new HG.FPSCounter();

		constructor(container: HTMLElement = document.body,
				clearColor: THREE.Color = new THREE.Color(0x000000)) {
			super();
			if (Utils.hasGL() === false) {
				var up = new Error("Your Browser doesn't support WebGL");
				throw up; //haha
			}
			this.camera = new THREE.PerspectiveCamera(HG.Settings.fov,
				window.innerWidth / window.innerHeight, 0.1, HG.Settings.viewDistance);
			this.renderer = new THREE.WebGLRenderer({antialias: HG.Settings.antialiasing});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setClearColor(clearColor, 1);
			container.appendChild(this.renderer.domElement);
		}

		preLoad(): void {
			console.log('loading assets');
			this.dispatch('PreLoad');
			console.log('loaded assets');
		}

		start(): void {
			this.dispatch('Start');
			this.isRunning = true;
		}

		onKeyUp(a: KeyboardEvent): void {
			this.controls.onKeyUp(a);
			this.dispatch('KeyUp', a);
		}

		onKeyDown(a: KeyboardEvent): void {
			this.controls.onKeyDown(a);
			this.dispatch('KeyDown', a);
		}

		onResize(): void {
			this.dispatch('Resize');
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		render(): void {
			var delta = this.fpsCounter.getFrameTime() / 10;
			this.dispatch('Render', delta);
			this.controls.frame(delta);
			this.fpsCounter.frame(delta);
			this.renderer.render(this.scene.scene, this.camera);
		}

	}

}