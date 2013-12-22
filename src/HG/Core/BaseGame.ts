/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-21 14:06:10
*/

module HG.Core {

	export class BaseGame extends  HG.Core.EventDispatcher  {

		startTime: number = Date.now();
		renderer: THREE.WebGLRenderer;
		resolution: THREE.Vector2;
		soundMixer: HG.Sound.Mixer;
		currentScene: HG.Scenes.Scene;
		pluginHost: HG.Core.PluginHost;
		controls: HG.Core.InputHandler;
		fpsCounter: HG.Utils.FPSCounter;
		params: HG.Utils.GameStartParameters;

		_running: boolean = false;
		events: string[] =
			["load", "connected", "start", "keyup", "keydown",
			"resize", "render", "mouseDown", "mouseUp",
			"mouseMove", "preRender", "postRender"];

		constructor(container: HTMLElement) {
			super();
			if (!HG.settings) {
				HG.settings = HG.Utils.defaultSettings;
				HG.locale.errors.defaultSettingsUsedWarning.warn();
			}
			new HG.Utils.UpdateChecker();
			this.controls = new HG.Core.InputHandler();
			this.pluginHost = new HG.Core.PluginHost(this);
			this.fpsCounter = new HG.Utils.FPSCounter();

			this.soundMixer = new HG.Sound.Mixer();
			this.soundMixer.volume(HG.settings.sound.masterVolume);

			this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
			for (var c in HG.settings.sound.channels) {
				var ch = new HG.Sound.Channel(c.replace("Volume", ""));
				ch.volume(HG.settings.sound.channels[c]);
				this.soundMixer.addChannel(ch);
			}
			if (HG._gl === true) {
				this.renderer = new THREE.WebGLRenderer({
					antialias: HG.settings.graphics.antialiasing
				});
				HG.settings.graphics.aa = this.renderer.getMaxAnisotropy();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
				container.appendChild(this.renderer.domElement);
			} else {
				return;
			}
		}

		set title(v: any[]) {
			document.title = v.join("");
		}

		scene(scene: HG.Scenes.Scene): void {
			this.pluginHost.dispatch("sceneChange", scene);
			this.renderer.setClearColor(scene.color, scene.colorAlpha);
			this.currentScene = scene;
		}

		screenshot(path: string, imageType: string = "image/png"): void {
			var data = this.renderer.domElement.toDataURL(imageType);
			// data:image/png;base64
			var raw = new Buffer(
				data.replace("data:" + imageType + ";base64,", ""), "base64");
			HG.Modules.fs.writeFile(path, raw);
		}

		load(): void {
			this.dispatch("load");
		}

		resize(resolution: THREE.Vector2): void {
			var whwnd = HG.Modules.ui.Window.get();
			whwnd.width = resolution.x;
			whwnd.height = resolution.y;
		}

		position(position: THREE.Vector2): void {
			var whwnd = HG.Modules.ui.Window.get();
			whwnd.x = position.x;
			whwnd.y = position.y;
		}

		setFullScreenMode(state: boolean): void {
			var whwnd = HG.Modules.ui.Window.get();
			if (state === true) {
				whwnd.enterFullscreen();
			} else {
				whwnd.leaveFullscreen();
			}
		}

		reload(): void {
			global.require.cache = {};
			var whwnd = HG.Modules.ui.Window.get();
			whwnd.reloadIgnoringCache();
		}

		toggleFullScreenMode(): void {
			var whwnd = HG.Modules.ui.Window.get();
			whwnd.toggleFullscreen();
		}

		start(params: HG.Utils.GameStartParameters): void {
			this.dispatch("start");
			this._running = true;
			if (params.noResize === true) {
				this.setFullScreenMode(HG.settings.graphics.fullscreen);
				this.resize(HG.settings.graphics.resolution);
			}
			if (params.profileFrame === true) {
				HG.Utils.profile("HG Profiling Frame", () => this.render.apply(this));
			}
			window.onresize = () => this.onResize.apply(this);
			if (params.input === true) {
				window.onkeydown = (a: any) => this.onKeyDown.apply(this, [a]);
				window.onkeyup = (a: any) => this.onKeyUp.apply(this, [a]);
				window.onmousemove = (a: any) => this.onMouseMove.apply(this, [a]);
				window.onmousedown = (a: any) => this.onMouseDown.apply(this, [a]);
				window.onmouseup = (a: any) => this.onMouseUp.apply(this, [a]);
			}
			var render;
			if (HG.settings.graphics.useStaticFramerate === true) {
				render = () => { this.render.apply(this); };
				setInterval(render, 1000 / HG.settings.graphics	.staticFramerate);
			} else {
				render = () => {
					this.render.apply(this);
					requestAnimationFrame(render);
				};
			}
			render();
		}

		onKeyUp(e: KeyboardEvent): void {
			this.controls.onKeyUp(e);
			this.currentScene.controls.onKeyUp(e);
			this.dispatch("keyUp", e);
		}

		onKeyDown(e: KeyboardEvent): void {
			this.controls.onKeyDown(e);
			this.currentScene.controls.onKeyDown(e);
			this.dispatch("keyDown", e);
		}

		onMouseDown(e: MouseEvent): void {
			this.controls.onMouseDown(e);
			this.currentScene.controls.onMouseDown(e);
			this.dispatch("mouseDown", e);
		}

		onMouseUp(e: MouseEvent): void {
			this.controls.onMouseUp(e);
			this.currentScene.controls.onMouseUp(e);
			this.dispatch("mouseUp", e);
		}

		onMouseMove(e: MouseEvent): void {
			this.controls.onMouseMove(e);
			this.currentScene.controls.onMouseMove(e);
			this.dispatch("mouseMove", e);
		}

		onResize(): void {
			this.dispatch("resize");
			this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
			this.currentScene.onResize(window.innerWidth / window.innerHeight);
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		render(): void {
			var delta = this.fpsCounter.frameTime / 10;
			this.dispatch("preRender", delta);
			this.currentScene.frame(delta);
			this.controls.frame(delta);
			this.fpsCounter.frame(delta);
			this.currentScene.getInternal().simulate();
			this.dispatch("render", delta);
			this.renderer.render(this.currentScene.getInternal(),
				this.currentScene.getCamera());
			this.dispatch("postRender", delta);
			console.timeStamp("rendered");
		}

	}

}