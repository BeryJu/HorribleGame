/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 20:58:54
*/

module HG.Core {

	export class BaseGame extends  HG.Core.EventDispatcher  {

		renderer: THREE.WebGLRenderer;
		camera: HG.Entities.CameraEntity;
		soundMixer: HG.Sound.Mixer;
		currentScene: HG.Scenes.BaseScene;
		pluginHost: HG.Core.PluginHost;
		controls: HG.Core.InputHandler = new HG.Core.InputHandler();
		fpsCounter: HG.Utils.FPSCounter = new HG.Utils.FPSCounter();

		_running: boolean = false;
		_title: string = "";
		events: string[] = [
			"load", "connected", "start", "keyup", "keydown",
			"resize", "render", "mouseDown", "mouseUp",
			"mouseMove", "preRender", "postRender"];

		constructor(container: HTMLElement, settingsPath: string) {
			super();
			var moduleLoader = new HG.Utils.ModuleLoader();
			HG.Settings = HG.loadSettings(settingsPath);

			this.soundMixer = new HG.Sound.Mixer();
			this.soundMixer.volume(HG.Settings.Sound.masterVolume);

			for (var c in HG.Settings.Sound.channels) {
				var ch = new HG.Sound.Channel(c.replace("Volume", ""));
				ch.volume(HG.Settings.Sound.channels[c]);
				this.soundMixer.addChannel(ch);
			}

			// HG.Utils.setFullScreenMode(HG.Settings.Graphics.fullscreen);
			// HG.Utils.resize(HG.Settings.Graphics.resolution);

			this.pluginHost = new HG.Core.PluginHost(this);

			this.camera = new HG.Entities.CameraEntity(
				HG.Settings.Graphics.fov,
				window.innerWidth / window.innerHeight, 0.1,
				HG.Settings.Graphics.viewDistance);
			this.renderer = new THREE.WebGLRenderer({
				antialias: HG.Settings.Graphics.antialiasing
			});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(this.renderer.domElement);
		}

		set title(v: any[]) {
			document.title = v.join("");
		}

		scene(scene: HG.Scenes.BaseScene): void {
			this.pluginHost.dispatch('sceneChange', scene);
			this.currentScene = scene;
		}

		screenshot(path: string, imageType: string = "image/png"): void {
			var data = this.renderer.domElement.toDataURL(imageType);
			console.debug(data);
			//data:image/png;base64
			var raw = new Buffer(data.replace("data:"+imageType+";base64,", ""), 'base64');
			global.fs.writeFile(path, raw);
		}

		load(): void {
			console.time("HG.loadResources");
			this.dispatch('load');
			console.timeEnd("HG.loadResources");
		}

		connect(serverHost: string): void {
			// this.socketClient = global['socket.io-client'].connect(serverHost);
			// this.socketClient.on('news', (data) => {
			// 	console.log(data);
			// });
			// this.dispatch("connected", serverHost);
		}

		start(): void {
			this.dispatch('start');
			this._running = true;
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
			this.dispatch('preRender', delta);
			this.dispatch('render', delta);
			this.currentScene.forNamed((e) => e.frame(delta));
			this.currentScene.controls.frame(delta);
			this.camera.frame(delta);
			this.controls.frame(delta);
			this.fpsCounter.frame(delta);
			this.currentScene.getInternal().simulate();
			this.renderer.render(this.currentScene.getInternal(),
								<THREE.PerspectiveCamera> this.camera.getInternal());
			this.dispatch('postRender', delta);
		}

	}

}