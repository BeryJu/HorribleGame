/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-08 19:40:06
*/
///<reference path="EventDispatcher" />

module HG {

	export class BaseGame extends EventDispatcher {

		socketClient: SocketManager;
		renderer: THREE.WebGLRenderer;
		camera: HG.Entities.CameraEntity;
		isRunning: boolean = false;
		controls: HG.InputHandler = new HG.InputHandler();
		fpsCounter: HG.Utils.FPSCounter = new HG.Utils.FPSCounter();
		shaders: HG.Shader[] = [];
		eventsAvailable: string[] = ["load", "connected", 
			"start", "keyup", "keydown", "resize", "render",
			"mouseDown", "mouseUp", "mouseMove"];

		constructor(container: HTMLElement = document.body) {
			super();
			new HG.Utils.Bootstrapper().bootstrap();
			this.camera = new HG.Entities.CameraEntity(Settings.fov,
				window.innerWidth / window.innerHeight, 0.1, Settings.viewDistance);
			this.renderer = new THREE.WebGLRenderer({antialias: Settings.antialiasing});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(this.renderer.domElement);
		}

		loadShader(path): HG.Shader {
			var s = new HG.Shader(path);
			this.shaders.push(s);
			return s;
		}

		load(): void {
			console.log('[BaseGame] Loading assets');
			this.dispatch('load');
			console.log('[BaseGame] Loaded assets');
		}

		connect(serverHost: string): void {
			this.socketClient = global['socket.io-client'].connect(serverHost);
			this.socketClient.on('news', (data) => {
				console.log(data);
			});
			this.dispatch("connected", serverHost);
		}

		start(serverHost: string): void {
			this.connect(serverHost);
			this.dispatch('start');
			this.isRunning = true;
		}

		onKeyUp(e: KeyboardEvent): void {
			this.controls.onKeyUp(e);
			this.dispatch('keyUp', e);
		}

		onKeyDown(e: KeyboardEvent): void {
			this.controls.onKeyDown(e);
			this.dispatch('keyDown', e);
		}

		onMouseDown(e: MouseEvent): void {
			this.controls.onMouseDown(e);
			this.dispatch('mouseDown', e);
		}

		onMouseUp(e: MouseEvent): void {
			this.controls.onMouseUp(e);
			this.dispatch('mouseUp', e);
		}

		onMouseMove(e: MouseEvent): void {
			this.controls.onMouseMove(e);
			this.dispatch('mouseMove', e);
		}

		onResize(): void {
			this.dispatch('resize');
			this.camera.object.aspect = window.innerWidth / window.innerHeight;
			this.camera.object.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		render(scene: HG.Scenes.BaseScene): void {
			var delta = this.fpsCounter.getFrameTime() / 10;
			this.dispatch('render', delta);
			this.camera.frame(delta);
			this.controls.frame(delta);
			this.fpsCounter.frame(delta);
			scene.getInternal().simulate();
			this.renderer.render(scene.getInternal(), 
				<THREE.PerspectiveCamera> this.camera.getInternal());
		}

	}

}