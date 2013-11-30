/// <reference path="../../src/lib/lib.d.ts" />
/// <reference path="../../src/lib/node.d.ts" />
/// <reference path="../../src/lib/physijs.d.ts" />
/// <reference path="../../src/lib/socket.io.d.ts" />
/// <reference path="../../src/lib/three.d.ts" />
/// <reference path="../../src/lib/waa.d.ts" />
declare module HG.Core {
    class EventDispatcher {
        private _events;
        private globalEvents;
        public events: string[];
        constructor(events?: string[]);
        public resolve(raw: any): string;
        public onAll(callback: (...args: any[]) => any): any;
        public on(name: string[], callback?: (...args: any[]) => any): any;
        public on(name: string, callback?: (...args: any[]) => any): any;
        public on(name: number[], callback?: (...args: any[]) => any): any;
        public on(name: number, callback?: (...args: any[]) => any): any;
        public bind: {
            (name: string[], callback?: (...args: any[]) => any): any;
            (name: string, callback?: (...args: any[]) => any): any;
            (name: number[], callback?: (...args: any[]) => any): any;
            (name: number, callback?: (...args: any[]) => any): any;
        };
        public inject(name: any, callback: (...args: any[]) => any): any;
        public clear(name: string): any;
        public dispatch(name: string[], ...args: any[]): any;
        public dispatch(name: string, ...args: any[]): any;
        public dispatch(name: number[], ...args: any[]): any;
        public dispatch(name: number, ...args: any[]): any;
    }
}
declare module HG.Core {
    class PluginHost extends Core.EventDispatcher {
        public events: string[];
        public plugins: Core.IPlugin[];
        public paths: string[];
        public game: Core.BaseGame;
        constructor(instance: Core.BaseGame);
        public doReload(): void;
        public hook(instance: any, event: any, callback: (...args: any[]) => any): void;
        public load(path: string[], env?: {}): void;
    }
}
declare module HG.Core {
    class IPlugin {
        public name: string;
        constructor(host: Core.PluginHost, env: {});
        public frame(delta: number): void;
    }
}
declare module HG.LINQ {
    interface IProvider {
        provide(): void;
    }
}
declare module HG.Resource {
    interface IFiletype {
        load(path: string, ...args): any;
    }
}
declare module HG.Resource {
    interface ILoadable {
        load(data: {}): void;
    }
}
declare module HG.Utils {
    class ISettings {
        public debug: boolean;
        public Graphics: {
            fullscreen: boolean;
            fov: number;
            viewDistance: number;
            shadowMapSize: number;
            useStaticFramerate: boolean;
            staticFramerate: number;
            antialiasing: boolean;
            resolution: THREE.Vector2;
        };
        public Sound: {
            masterVolume: number;
            channels: {
                effectsEnvVolume: number;
                effectsSelfVolume: number;
                musicVolume: number;
            };
        };
        public Keys: {
            forward: number[];
            backward: number[];
            left: number[];
            right: number[];
            pause: number[];
            lower: number[];
            jump: number[];
            devConsole: number[];
            refresh: number[];
            fullscreen: number[];
        };
    }
}
declare module HG.Utils {
    class FPSCounter {
        private lastFrameTime;
        private lastSecond;
        private currentFrames;
        private highestFPS;
        private _frameTime;
        private fps;
        constructor();
        public FPS : number;
        public maxFPS : number;
        public frameTime : number;
        public frame(delta: number): void;
    }
}
declare module HG.Utils {
    var KeyMap: {
        D: number;
        A: number;
        S: number;
        W: number;
        Q: number;
        E: number;
        Left: number;
        Right: number;
        Top: number;
        Shift: number;
        Bottom: number;
        Space: number;
        Esc: number;
        F5: number;
        F11: number;
        F12: number;
    };
}
declare module HG.Utils {
    class Map<T> {
        public data: {};
        public set<T>(data: T, x?: number, y?: number, z?: number): boolean;
        public get<T>(x?: number, y?: number, z?: number, fallback?: any): T;
        public clearX(x: number): boolean;
        public clearY(x: number, y: number): boolean;
        public clearZ(x: number, y: number, z: number): boolean;
    }
}
declare module HG.Utils {
    class ModuleLoader extends HG.Core.EventDispatcher {
        public modules: string[];
        constructor(additional?: string[]);
    }
}
declare module HG.Utils {
    class Noise {
        static perm: number[];
        static Generate2(x: number, y: number): number;
        static Generate3(x: number, y: number, z: number): number;
        static Mod(x: number, m: number): number;
        static grad1(hash: number, x: number): number;
        static grad2(hash: number, x: number, y: number): number;
        static grad3(hash: number, x: number, y: number, z: number): number;
        static grad4(hash: number, x: number, y: number, z: number, t: number): number;
    }
}
declare module HG {
    var Settings: Utils.ISettings;
    function loadSettings(path: string, fallback?: Utils.ISettings): Utils.ISettings;
    function saveSettings(path: string, settings: Utils.ISettings, pretty?: boolean): void;
}
declare module HG.Utils {
    function rgbToHex(r: number, g: number, b: number): number;
    function bootstrap(gInstance: HG.Core.BaseGame, wnd: Window): void;
    function profile(fn: () => any): void;
    function hasGL(): boolean;
    function resize(resolution: THREE.Vector2): void;
    function position(position: THREE.Vector2): void;
    function setFullScreenMode(state: boolean): void;
    function reload(): void;
    function toggleFullScreenMode(): void;
    function openDevConsole(): void;
    function openDevConsoleExternal(): void;
    function isNode(): boolean;
}
declare module HG.Entities {
    class BaseEntity extends HG.Core.EventDispatcher implements HG.Resource.ILoadable {
        public abilities: HG.Abilities.BaseAbility[];
        public object: THREE.Object3D;
        public positionOffset: THREE.Vector3;
        constructor(object?: THREE.Object3D);
        public ability(a: HG.Abilities.BaseAbility): boolean;
        public forAbilities(callback: (a: HG.Abilities.BaseAbility) => void): void;
        public offset(x: number, y: number, z: number): BaseEntity;
        public load(data: {}): void;
        public scale(x: number, y: number, z: number): BaseEntity;
        public position(x: number, y: number, z: number): BaseEntity;
        public rotate(x: number, y: number, z: number): BaseEntity;
        public getInternal(): THREE.Object3D;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class BaseAbility extends HG.Core.EventDispatcher {
        public hostEntity: HG.Entities.BaseEntity;
        public setHost(entity: HG.Entities.BaseEntity): void;
        public checkCompatibility(entity: HG.Entities.BaseEntity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Scenes {
    class BaseScene {
        public scene: Physijs.Scene;
        public controls: HG.Core.InputHandler;
        public entities: {
            named: {};
            unnamed: HG.Entities.BaseEntity[];
        };
        constructor();
        public add(entity: HG.Entities.BaseEntity, nameTag?: string): void;
        public getAllNamed(type?: any): any[];
        public getAllUnnamed(type?: any): any[];
        public getAll(type?: any): any[];
        public forNamed(callback: (e: any, k: string) => any, type?: any): void;
        public forUnamed(callback: (e: any) => any, type?: any): void;
        public forAll(callback: (e: any) => any, type?: any): void;
        public getInternal(): Physijs.Scene;
        public get(nameTag: string[], type?: any): any[];
    }
}
declare module HG {
    var __START: number;
    function horrible(): any;
}
declare module HG.Abilities {
    class AnimationAbility extends Abilities.BaseAbility {
        public animOffset: number;
        public running: boolean;
        public duration: number;
        public keyframes: number;
        public interpolation: number;
        public lastKeyframe: number;
        public currentKeyframe: number;
        public events: string[];
        public setHost(entity: HG.Entities.BaseEntity): void;
        public checkCompatibility(entity: HG.Entities.BaseEntity): boolean;
        public load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class MovingAbility extends Abilities.BaseAbility {
        public jumpState: number;
        public oldY: number;
        public maxY: number;
        public moveLeft(step: number): void;
        public moveRight(step: number): void;
        public lower(step: number): void;
        public turnLeft(step: number): void;
        public turnRight(step: number): void;
        public moveForward(step: number): void;
        public moveBackward(step: number): void;
        public jump(): void;
        public frame(delta: number): void;
    }
}
declare module HG.Core {
    class BaseGame extends Core.EventDispatcher {
        public renderer: THREE.WebGLRenderer;
        public camera: HG.Entities.CameraEntity;
        public soundMixer: HG.Sound.Mixer;
        public currentScene: HG.Scenes.BaseScene;
        public pluginHost: Core.PluginHost;
        public controls: Core.InputHandler;
        public fpsCounter: HG.Utils.FPSCounter;
        public _running: boolean;
        public _title: string;
        public events: string[];
        constructor(container: HTMLElement, settingsPath: string);
        public title : any[];
        public scene(scene: HG.Scenes.BaseScene): void;
        public screenshot(path: string, imageType?: string): void;
        public load(): void;
        public connect(serverHost: string): void;
        public start(): void;
        public onKeyUp(e: KeyboardEvent): void;
        public onKeyDown(e: KeyboardEvent): void;
        public onMouseDown(e: MouseEvent): void;
        public onMouseUp(e: MouseEvent): void;
        public onMouseMove(e: MouseEvent): void;
        public onResize(): void;
        public render(): void;
    }
}
declare module HG.Core {
    class BaseServer extends Core.EventDispatcher {
        public socketServer: SocketManager;
        constructor(port: number);
    }
}
declare module HG.Core {
    class InputHandler {
        public mouse: Core.EventDispatcher;
        public keyboard: Core.EventDispatcher;
        private keyState;
        private mouseState;
        private _mouse;
        public mousePosition : THREE.Vector2;
        constructor();
        public onMouseMove(e: MouseEvent): void;
        public onMouseDown(e: MouseEvent): void;
        public onMouseUp(e: MouseEvent): void;
        public onKeyDown(e: KeyboardEvent): void;
        public onKeyUp(e: KeyboardEvent): void;
        public frame(delta: number): void;
    }
}
declare module HG {
    class ServerConnection extends HG.Core.EventDispatcher {
        public socket: Socket;
        constructor(host: string);
    }
}
declare module HG.Core {
    class Shader extends Core.EventDispatcher {
        public vertexShader: string;
        public fragmentShader: string;
        constructor(path?: string);
        public load(raw: {}): void;
    }
}
declare module HG.Entities {
    class CameraEntity extends Entities.BaseEntity {
        public object: THREE.PerspectiveCamera;
        constructor(fov?: number, aspect?: number, zNear?: number, zFar?: number);
        public setViewDistance(distance: number): void;
        public resize(ratio: number): void;
    }
}
declare module HG.Entities {
    class ChasingCameraEntity extends Entities.CameraEntity {
        public object: THREE.PerspectiveCamera;
        public target: Entities.MeshEntity;
        public lookAt: boolean;
        constructor(target: Entities.MeshEntity, fov?: number, aspect?: number, zNear?: number, zFar?: number);
        public frame(delta: number): void;
    }
}
declare module HG.Entities {
    class FirstPersonCameraEntity extends Entities.CameraEntity {
        public object: THREE.PerspectiveCamera;
        public target: Entities.MeshEntity;
        public lookAt: boolean;
        constructor(fov?: number, aspect?: number, zNear?: number, zFar?: number);
        public setViewDistance(d: number): void;
        public frame(delta: number): void;
    }
}
declare module HG.Entities {
    class HeightMapEntity extends Entities.BaseEntity {
        constructor(directory: string, size?: number, directions?: string[], suffix?: string);
    }
}
declare module HG.Entities {
    class MeshEntity extends Entities.BaseEntity implements HG.Resource.ILoadable {
        public object: THREE.Mesh;
        public events: string[];
        constructor(geo?: THREE.Geometry, mat?: THREE.MeshBasicMaterial);
        public load(data: {}): void;
    }
}
declare module HG.Entities {
    class ParticleEntity extends Entities.BaseEntity {
        public count: number;
        public size: number;
        public color: number;
        public map: string;
        constructor(map: string, count?: number, size?: number);
        public create(): void;
    }
}
declare module HG.Entities {
    class VideoEntity extends Entities.BaseEntity {
        constructor(url?: string);
    }
}
declare module HG.LINQ {
    class ArrayProvider implements LINQ.IProvider {
        public each(context: any[], fn: (e: any) => any): void;
        public where(context: any[], query: (e: any) => boolean): any[];
        public order(context: any[], order: (a: any, b: any) => any): any[];
        public select(context: any[], selector: (e: any) => any): any[];
        public registerFunction(key: string, fn: (...args: any[]) => any): void;
        public provide(): void;
    }
}
declare module HG.LINQ {
    function initialize(): void;
}
declare module HG.LINQ {
    class NumberProvider implements LINQ.IProvider {
        public toRadian(nmb: number): number;
        public toDegrees(nmb: number): number;
        public registerFunction(key: string, fn: (...args: any[]) => any): void;
        public provide(): void;
    }
}
declare module HG.LINQ {
    class StringProvider implements LINQ.IProvider {
        public f(context: string, ...args: any[]): string;
        public replaceAll(context: string, find: string, replace: string): string;
        public registerFunction(key: string, fn: (...args: any[]) => any): void;
        public provide(): void;
    }
}
declare module HG.Resource.Model {
    class JS extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Resource.Model {
    class STL extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string, material?: THREE.MeshFaceMaterial): void;
    }
}
declare module HG.Resource {
    class ResourceLoader extends HG.Core.EventDispatcher {
        public baseDirectory: string;
        constructor(baseDirectory: string);
        public resolvePath(path: string): string;
        private load(relPath, target, namespace);
        public model(path: string, entitiy: HG.Entities.MeshEntity): void;
        public texture(path: string, entitiy: HG.Entities.BaseEntity): void;
        public sound(path: string, effect: HG.Sound.Effect): void;
        public directory(directory: string): string[];
    }
}
declare module HG.Resource.Sound {
    class WAV extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string, context: AudioContext): void;
    }
}
declare module HG.Resource.Texture {
    class PNG extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Sound {
    class Channel extends HG.Core.EventDispatcher {
        public name: string;
        public rootContext: AudioContext;
        public gainNode: GainNode;
        public events: string[];
        public gain : number;
        constructor(name: string);
        public volume(gain: number): void;
    }
}
declare module HG.Sound {
    class Effect implements HG.Resource.ILoadable {
        public name: string;
        public gainNode: GainNode;
        public destination: Sound.Channel;
        public source: AudioBufferSourceNode;
        public buffer: AudioBuffer;
        public rootContext: AudioContext;
        public gain : number;
        constructor(ch: Sound.Channel);
        public load(data: AudioBuffer): void;
        public recreate(): void;
        public play(): void;
        public stop(): void;
        private volume(gain);
    }
}
declare module HG.Sound {
    class Mixer {
        public channels: {};
        public gainNode: GainNode;
        public context: AudioContext;
        public gain : number;
        public channel(name: string): Sound.Channel;
        constructor();
        public volume(gain: number): void;
        public addChannel(ch: Sound.Channel): void;
    }
}
