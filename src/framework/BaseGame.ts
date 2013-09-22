///<reference path="EventDispatcher" />

module HG {

	export class BaseGame extends EventDispatcher{
		_: {} = {};
		Renderer: THREE.WebGLRenderer;
		Camera: THREE.PerspectiveCamera;
		IsRunning: boolean = false;
		Scene: HG.Scene = new HG.Scene();
		Controls: HG.InputHandler = new HG.InputHandler();
		FPSCounter: HG.FPSCounter = new HG.FPSCounter();

		constructor(Container: HTMLElement = document.body,
				clearColor: THREE.Color = new THREE.Color(0x000000)) {
			super();
			if (Utils.hasGL() === false) {
				var up = new Error("Your Browser doesn't support WebGL");
				throw up; //haha
			}
			this.Renderer = new THREE.WebGLRenderer({antialias: HG.Settings.Antialiasing});
			this.Camera = new THREE.PerspectiveCamera(HG.Settings.FOV,
				window.innerWidth / window.innerHeight, 0.1, HG.Settings.ViewDistance);
			this.Renderer.setSize(window.innerWidth, window.innerHeight);
			this.Renderer.setClearColor(clearColor, 1);
			try {
				Container.appendChild(this.Renderer.domElement);
			} catch (e) {
				throw new Error("Container is not a valid HTMLElement");
				console.log(Container);
			}
		}

		PreLoad(): void {
			console.log('loading assets');
			this.Dispatch('PreLoad');
			console.log('loaded assets');
		}

		Start(): void {
			this.Dispatch('Start');
			this.IsRunning = true;
		}

		OnKeyUp(a: KeyboardEvent): void {
			this.Controls.OnKeyUp(a);
			this.Dispatch('KeyUp', a);
		}

		OnKeyDown(a: KeyboardEvent): void {
			this.Controls.OnKeyDown(a);
			this.Dispatch('KeyDown', a);
		}

		OnResize(): void {
			this.Dispatch('Resize');
			this.Camera.aspect = window.innerWidth / window.innerHeight;
			this.Camera.updateProjectionMatrix();
			this.Renderer.setSize(window.innerWidth, window.innerHeight);
		}

		Render(): void {
			this.Dispatch('Render');
			this.Controls.Frame(this.FPSCounter.getFrameTime());
			this.FPSCounter.Frame();
			this.Renderer.render(this.Scene.Scene, this.Camera);
		}

	}

}