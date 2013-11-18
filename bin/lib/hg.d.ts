declare module HG {
    class EventDispatcher {
        private events;
        private globalEvents;
        public eventsAvailable: string[];
        public resolve(raw: any): string;
        public onAll(callback: (...args: any[]) => any): any;
        public on(name: string[], callback?: (...args: any[]) => any): any;
        public on(name: string, callback?: (...args: any[]) => any): any;
        public on(name: number[], callback?: (...args: any[]) => any): any;
        public on(name: number, callback?: (...args: any[]) => any): any;
        public inject(name: any, callback: (...args: any[]) => any): any;
        public clear(name: string): any;
        public dispatch(name: string[], ...args: any[]): any;
        public dispatch(name: string, ...args: any[]): any;
        public dispatch(name: number[], ...args: any[]): any;
        public dispatch(name: number, ...args: any[]): any;
    }
}
declare module HG {
    class BaseGame extends HG.EventDispatcher {
        public socketClient: SocketManager;
        public renderer: THREE.WebGLRenderer;
        public camera: HG.Entities.CameraEntity;
        public isRunning: boolean;
        public soundMixer: HG.Sound.Mixer;
        public currentScene: HG.Scenes.BaseScene;
        public pluginHost: HG.Plugins.PluginHost;
        public controls: HG.InputHandler;
        public fpsCounter: HG.Utils.FPSCounter;
        public shaders: HG.Shader[];
        public eventsAvailable: string[];
        constructor(container?: HTMLElement, settings?: string);
        public screenshot(path: string, imageType?: string): void;
        public scene(s: HG.Scenes.BaseScene): void;
        public title(...args: string[]): void;
        public loadShader(path): HG.Shader;
        public load(): void;
        public connect(serverHost: string): void;
        public start(serverHost: string): void;
        public onKeyUp(e: KeyboardEvent): void;
        public onKeyDown(e: KeyboardEvent): void;
        public onMouseDown(e: MouseEvent): void;
        public onMouseUp(e: MouseEvent): void;
        public onMouseMove(e: MouseEvent): void;
        public onResize(): void;
        public render(): void;
    }
}
declare module HG {
    class BaseServer extends HG.EventDispatcher {
        public socketServer: SocketManager;
        constructor(port: number);
    }
}
declare module HG {
    var _warn: (message?: any, ...optionalParams: any[]) => void;
    var _error: (message?: any, ...optionalParams: any[]) => void;
    var _log: (message?: any, ...optionalParams: any[]) => void;
    function horrible(): void;
}
declare module HG.Plugins {
    class PluginHost extends HG.EventDispatcher {
        public eventsAvailable: string[];
        public plugins: Plugins.IPlugin[];
        public paths: string[];
        public game: HG.BaseGame;
        constructor(instance: HG.BaseGame);
        public doReload(): void;
        public hook(instance: any, event: any, callback: (...args: any[]) => any): void;
        public load(path: string[], env?: {}): void;
        public frame(delta: number): void;
    }
}
declare module HG.Plugins {
    class IPlugin {
        public name: string;
        constructor(host: Plugins.PluginHost, env: {});
        public frame(delta: number): void;
    }
}
declare module HG {
    class InputHandler extends HG.EventDispatcher {
        private keyState;
        private mouseState;
        private lastMouse;
        public eventsAvailable: string[];
        public bind: {
            (name: string[], callback?: (...args: any[]) => any): any;
            (name: string, callback?: (...args: any[]) => any): any;
            (name: number[], callback?: (...args: any[]) => any): any;
            (name: number, callback?: (...args: any[]) => any): any;
        };
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
    class Renderer extends THREE.WebGLRenderer {
        constructor(params: {});
    }
}
declare module HG {
    class ServerConnection extends HG.EventDispatcher {
        public socket: Socket;
        constructor(host: string);
    }
}
declare module HG {
    class Shader extends HG.EventDispatcher {
        public vertexShader: string;
        public fragmentShader: string;
        constructor(path?: string);
        public load(raw: {}): void;
    }
}
declare module HG {
    class BaseAbility extends HG.EventDispatcher {
        public hostEntity: HG.BaseEntity;
        public setHost(entity: HG.BaseEntity): void;
        public checkCompatibility(entity: HG.BaseEntity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class AnimationAbility extends HG.BaseAbility {
        public animOffset: number;
        public running: boolean;
        public duration: number;
        public keyframes: number;
        public interpolation: number;
        public lastKeyframe: number;
        public currentKeyframe: number;
        public eventsAvailable: string[];
        public setHost(entity: HG.BaseEntity): void;
        public checkCompatibility(entity: HG.BaseEntity): boolean;
        public fromJS(path: string): void;
        public load(geometry: THREE.Geometry, materials: THREE.MeshLambertMaterial[]): void;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class MovingAbility extends HG.BaseAbility {
        public moveLeft(step: number): void;
        public moveRight(step: number): void;
        public lower(step: number): void;
        public turnLeft(step: number): void;
        public turnRight(step: number): void;
        public moveForward(step: number): void;
        public moveBackward(step: number): void;
        public jumpState: number;
        public oldY: number;
        public maxY: number;
        public jump(): void;
        public frame(delta: number): void;
    }
}
declare module HG {
    class BaseEntity extends HG.EventDispatcher {
        public abilities: HG.BaseAbility[];
        public object: THREE.Object3D;
        public positionOffset: THREE.Vector3;
        constructor(object?: THREE.Object3D);
        public ability(a: HG.BaseAbility): boolean;
        public forAbilities(callback: (a: HG.BaseAbility) => void): void;
        public offset(x: number, y: number, z: number): BaseEntity;
        public scale(x: number, y: number, z: number): BaseEntity;
        public position(x: number, y: number, z: number): BaseEntity;
        public rotate(x: number, y: number, z: number): BaseEntity;
        public getInternal(): THREE.Object3D;
        public frame(delta: number): void;
    }
}
declare module HG.Entities {
    class CameraEntity extends HG.BaseEntity {
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
    class HeightMapEntity extends HG.BaseEntity {
        constructor(directory: string, size?: number, directions?: string[], suffix?: string);
    }
}
declare module HG.Entities {
    class MeshEntity extends HG.BaseEntity implements HG.Resource.ILoadable {
        public abilities: HG.BaseAbility[];
        public object: THREE.Mesh;
        public positionOffset: THREE.Vector3;
        constructor(geo?: THREE.Geometry, mat?: THREE.MeshBasicMaterial);
        public load(data: HG.Resource.LoadData): void;
    }
}
declare module HG.Entities {
    class ParticleEntity extends HG.BaseEntity {
        public count: number;
        public size: number;
        public color: number;
        public map: string;
        constructor(map: string, count?: number, size?: number);
        public create(): void;
    }
}
declare module HG.Entities {
    class SkyBoxEntity extends HG.BaseEntity {
        constructor(directory: string, size?: number, directions?: string[], suffix?: string);
    }
}
declare module HG.Entities {
    class VideoEntity extends HG.BaseEntity {
        constructor(url?: string);
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
    module CONSTANTS {
        var SIZE_X: number;
        var SIZE_Y: number;
        var BLOCK_SIZE: number;
    }
    class LevelStructure extends HG.EventDispatcher {
        public entities: HG.LevelStructureEntity[];
        public camera: {
            position: {
                x: number;
                y: number;
                z: number;
            };
            rotation: {
                x: number;
                y: number;
                z: number;
            };
        };
        public eventsAvailable: string[];
        public fromJS(path: string): void;
        public create(): void;
    }
}
declare module HG {
    class Level extends HG.EventDispatcher {
        public entities: HG.BaseEntity[];
        public camera: {
            position: THREE.Vector3;
            rotation: THREE.Vector3;
        };
        constructor(lvl: HG.LevelStructure);
        public applyCamera(camera: HG.Entities.CameraEntity): void;
        public applyCameraOffset(camera: HG.Entities.CameraEntity): void;
    }
}
declare module HG {
    class LevelStructureEntity {
        public position: {
            x: number;
            y: number;
            z: number;
        };
        public color: number;
    }
}
declare module HG.LINQ {
    interface IProvider {
        provide(): void;
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
declare module HG.Resource {
    interface IFiletype {
        load(path: string): any;
    }
}
declare module HG.Resource {
    interface ILoadable {
        load(data: Resource.LoadData): void;
    }
}
declare module HG.Resource {
    interface LoadData {
        loader: HG.ResourceLoader;
        doStuff: () => boolean;
    }
}
declare module HG {
    class ResourceLoader extends HG.EventDispatcher {
        public baseDirectory: string;
        constructor(baseDirectory: string);
        public model(path: string): HG.Resource.LoadData;
        public directory(directory: string): string[];
    }
}
declare module HG.Resource.Model {
    class JS extends HG.EventDispatcher implements Resource.IFiletype {
        public load(path: string): void;
    }
}
declare module HG.Resource.Model {
    class STL extends HG.EventDispatcher implements Resource.IFiletype {
        public load(path: string, material?: THREE.MeshFaceMaterial): void;
    }
}
declare module HG.Scenes {
    class BaseScene {
        public scene: Physijs.Scene;
        public controls: HG.InputHandler;
        public entities: {
            named: {};
            unnamed: HG.BaseEntity[];
        };
        constructor();
        public add(BaseEntity: HG.BaseEntity, nameTag?: string): void;
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
declare module HG.Sound {
    class BufferLoader {
        public context: AudioContext;
        constructor(context: AudioContext);
        public loadBuffer(url: string, onload: (buffer: AudioBuffer) => void): void;
        public load(urls: string[], cb: (buffers: AudioBuffer) => void): void;
    }
}
declare module HG.Sound {
    class Channel extends HG.EventDispatcher {
        public name: string;
        public rootContext: AudioContext;
        public gainNode: GainNode;
        public eventsAvailable: string[];
        public gain : number;
        constructor(name: string);
        public volume(gain: number): void;
    }
}
declare module HG.Sound {
    class Effect {
        public name: string;
        public gainNode: GainNode;
        public destination: Sound.Channel;
        public source: AudioBufferSourceNode;
        public rootContext: AudioContext;
        public gain : number;
        constructor(ch: Sound.Channel);
        public fromFile(path: string): void;
        public load(buffer: AudioBuffer): void;
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
        constructor();
        public volume(gain: number): void;
        public addChannel(ch: Sound.Channel): void;
    }
}
declare module HG.Utils {
    class Bootstrapper extends HG.EventDispatcher {
        public eventsAvailable: string[];
        constructor();
        public bootstrap(): void;
        public error(error: string, ...args: any[]): void;
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
        D: string;
        A: string;
        S: string;
        W: string;
        Q: string;
        E: string;
        Left: string;
        Right: string;
        Top: string;
        Shift: string;
        Bottom: string;
        Space: string;
        Esc: string;
        F5: string;
        F11: string;
        F12: string;
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
    class ModuleLoader extends HG.EventDispatcher {
        public modules: string[];
        constructor(additional?: string[]);
    }
}
declare module HG {
    class SettingsStructure {
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
            forward: string[];
            backward: string[];
            left: string[];
            right: string[];
            pause: string[];
            lower: string[];
            jump: string[];
            devConsole: string[];
            refresh: string[];
            fullscreen: string[];
        };
    }
}
declare module HG {
    var Settings: SettingsStructure;
    function loadSettings(path: string, fallback?: SettingsStructure): SettingsStructure;
    function saveSettings(path: string, settings: SettingsStructure, pretty?: boolean): void;
}
declare module HG.Utils {
    function rgbToHex(r: number, g: number, b: number): number;
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
