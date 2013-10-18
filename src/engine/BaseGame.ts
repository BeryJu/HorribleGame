///<reference path="EventDispatcher" />
/*
* BaseGame.ts
* Author: BeryJu
*/

module HG {

	export class BaseGame extends EventDispatcher {
		_: {} = {};
		socketClient: SocketManager;
		renderer: THREE.WebGLRenderer;
		camera: THREE.PerspectiveCamera;
		isRunning: boolean = false;
		scene: HG.Scene = new HG.Scene();
		controls: HG.InputHandler = new HG.InputHandler();
		fpsCounter: HG.FPSCounter = new HG.FPSCounter();
		eventsAvailable: string[] = ["preload", "connected", 
			"start", "keyup", "keydown", "resize", "render"];

		constructor(container: HTMLElement = document.body,
				clearColor: THREE.Color = new THREE.Color(0x000000)) {
			super();
			if (HG.Utils.hasGL() === false) {
				throw new Error("Your Browser doesn't support WebGL");
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
			this.dispatch('preload');
			console.log('loaded assets');
		}

		connect(serverHost: string): void {
			var io = require('socket.io-client');
			if (this.socketClient !== undefined) {
				// this.socketClient.disconnect();
			}
			this.socketClient = io.connect(serverHost);
			this.socketClient.on('news', function (data) {
				console.log(data);
			});
			this.dispatch("connected", {host: serverHost});
		}

		start(serverHost: string): void {
			this.connect(serverHost);
			this.dispatch('start');
			this.isRunning = true;
		}

		onKeyUp(a: KeyboardEvent): void {
			this.controls.onKeyUp(a);
			this.dispatch('keyUp', {event: a});
		}

		onKeyDown(a: KeyboardEvent): void {
			this.controls.onKeyDown(a);
			this.dispatch('keyDown', {event: a});
		}

		onResize(): void {
			this.dispatch('resize');
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		render(): void {
			var delta = this.fpsCounter.getFrameTime() / 10;
			this.dispatch('render', {delta: delta});
			this.controls.frame(delta);
			this.fpsCounter.frame(delta);
			this.renderer.render(this.scene.scene, this.camera);
		}

	}

}