/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-20 17:31:18
*/
///<reference path="EventDispatcher.ts" />

module HG {

	export class BaseGame extends HG.EventDispatcher {

		// socketClient: SocketManager;
		renderer: HG.Renderer;
		camera: HG.Entities.CameraEntity;
		isRunning: boolean = false;
		soundMixer: HG.Sound.Mixer;
		currentScene: HG.BaseScene;
		pluginHost: HG.Plugins.PluginHost;
		controls: HG.InputHandler = new HG.InputHandler();
		fpsCounter: HG.Utils.FPSCounter = new HG.Utils.FPSCounter();
		shaders: HG.Shader[] = [];
		eventsAvailable: string[] = ["load", "connected", 
			"start", "keyup", "keydown", "resize", "render",
			"mouseDown", "mouseUp", "mouseMove"];

		constructor(container: HTMLElement = document.body,
					settings: string = "") {
			super();
			var moduleLoader = new HG.Utils.ModuleLoader();
			HG.Settings = HG.loadSettings(settings, new HG.SettingsStructure());

			this.soundMixer = new HG.Sound.Mixer();
			this.soundMixer.volume(HG.Settings.Sound.masterVolume);
			for (var c in HG.Settings.Sound.channels) {
				var ch = new HG.Sound.Channel(c.replace("Volume", ""));
				ch.volume(HG.Settings.Sound.channels[c]);
				this.soundMixer.addChannel(ch);
			}

			// HG.Utils.setFullScreenMode(HG.Settings.Graphics.fullscreen);
			// HG.Utils.resize(HG.Settings.Graphics.resolution);

			this.pluginHost = new HG.Plugins.PluginHost(this);

			this.camera = new HG.Entities.CameraEntity(
				HG.Settings.Graphics.fov,
				window.innerWidth / window.innerHeight, 0.1, 
				HG.Settings.Graphics.viewDistance);
			this.renderer = new HG.Renderer({
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

		scene(s: HG.BaseScene): void {
			this.pluginHost.dispatch('sceneChange', s);
			this.currentScene = s;
		}

		title(...args: string[]): void {
			document.title = args.join("");
		}

		loadShader(path): HG.Shader {
			var s = new HG.Shader(path);
			this.shaders.push(s);
			return s;
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
			this.currentScene.forNamed((e) => e.frame(delta));
			this.currentScene.controls.frame(delta);
			this.camera.frame(delta);
			this.controls.frame(delta);
			this.fpsCounter.frame(delta);
			this.currentScene.getInternal().simulate();
			this.renderer.draw(this.currentScene, this.camera);
		}

	}

}