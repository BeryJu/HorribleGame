/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-12 20:46:46
*/
///<reference path="EventDispatcher.ts" />

module HG {

	export class BaseGame extends EventDispatcher {

		socketClient: SocketManager;
		renderer: THREE.WebGLRenderer;
		camera: HG.Entities.CameraEntity;
		isRunning: boolean = false;
		soundMixer: HG.Sound.Mixer;
		currentScene: HG.Scenes.BaseScene;
		pluginHost: HG.Plugins.PluginHost;
		controls: HG.InputHandler = new HG.InputHandler();
		fpsCounter: HG.Utils.FPSCounter = new HG.Utils.FPSCounter();
		shaders: HG.Shader[] = [];
		eventsAvailable: string[] = ["load", "connected", 
			"start", "keyup", "keydown", "resize", "render",
			"mouseDown", "mouseUp", "mouseMove"];

		constructor(container: HTMLElement = document.body) {
			super();
			new HG.Utils.Bootstrapper().bootstrap();

			this.soundMixer = new HG.Sound.Mixer();
			this.soundMixer.volume(HG.Settings.Sound.masterVolume);
			for (var c in HG.Settings.Sound.channels) {
				var ch = new HG.Sound.Channel(c.replace("Volume", ""));
				ch.volume(HG.Settings.Sound.channels[c]);
				this.soundMixer.addChannel(ch);
			}

			HG.Utils.setFullScreenMode(HG.Settings.Graphics.fullscreen);
			HG.Utils.resize(HG.Settings.Graphics.resolution);

			this.pluginHost = new HG.Plugins.PluginHost(this);

			this.camera = new HG.Entities.CameraEntity(
				HG.Settings.Graphics.fov,
				window.innerWidth / window.innerHeight, 0.1, 
				HG.Settings.Graphics.viewDistance);
			this.renderer = new THREE.WebGLRenderer({
				antialias: HG.Settings.Graphics.antialiasing,
				preserveDrawingBuffer: true
			});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(this.renderer.domElement);
		}

		screenshot(path: string, imageType: string = "image/png"): void {
			var data = this.renderer.domElement.toDataURL(imageType);
			console.debug(data);
			//data:image/png;base64
			var raw = new Buffer(data.replace("data:"+imageType+";base64,", ""), 'base64');
			global.fs.writeFile(path, raw);
		}

		scene(s: HG.Scenes.BaseScene): void {
			this.pluginHost.dispatch('sceneChange', s);
			this.currentScene = s;
		}

		title(...args): void {
			document.title = args.join("");
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
			this.currentScene.controls.onKeyUp(e);
			this.dispatch('keyUp', e);
		}

		onKeyDown(e: KeyboardEvent): void {
			this.controls.onKeyDown(e);
			this.currentScene.controls.onKeyDown(e);
			this.dispatch('keyDown', e);
		}

		onMouseDown(e: MouseEvent): void {
			this.controls.onMouseDown(e);
			this.currentScene.controls.onMouseDown(e);
			this.dispatch('mouseDown', e);
		}

		onMouseUp(e: MouseEvent): void {
			this.controls.onMouseUp(e);
			this.currentScene.controls.onMouseUp(e);
			this.dispatch('mouseUp', e);
		}

		onMouseMove(e: MouseEvent): void {
			this.controls.onMouseMove(e);
			this.currentScene.controls.onMouseMove(e);
			this.dispatch('mouseMove', e);
		}

		onResize(): void {
			this.dispatch('resize');
			this.camera.resize(window.innerWidth / window.innerHeight);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		render(): void {
			var delta = this.fpsCounter.frameTime / 10;
			this.dispatch('render', delta);
			this.camera.frame(delta);
			this.controls.frame(delta);
			this.currentScene.controls.frame(delta);
			this.fpsCounter.frame(delta);
			scene.getInternal().simulate();
			this.renderer.render(this.currentScene.getInternal(), 
				<THREE.PerspectiveCamera> this.camera.getInternal());
		}

	}

}