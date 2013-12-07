/// <reference path="../../src/lib/LINQ.d.ts" />
/// <reference path="../../src/lib/lib.d.ts" />
/// <reference path="../../src/lib/node.d.ts" />
/// <reference path="../../src/lib/physijs.d.ts" />
/// <reference path="../../src/lib/three.d.ts" />
/// <reference path="../../src/lib/waa.d.ts" />
declare module HG.Core {
    class EventDispatcher {
        private _events;
        private globalEvents;
        public events: string[];
        constructor(events?: string[]);
        private resolve(raw);
        public onAll(eventHandler: (...args: any[]) => any): EventDispatcher;
        public on(name: any, eventHandler?: Function): EventDispatcher;
        public bind: (name: any, eventHandler?: Function) => EventDispatcher;
        public addEventListener: (name: any, eventHandler?: Function) => EventDispatcher;
        public inject(name: any, eventHandler: Function): EventDispatcher;
        public clear(name: string): EventDispatcher;
        public dispatch(name: any, ...args: any[]): EventDispatcher;
        public emit: (name: any, ...args: any[]) => EventDispatcher;
    }
}
declare module HG.Modules {
    var fs: any;
    var path: any;
    var http: any;
    var ui: any;
    var net: any;
}
declare module HG.Core {
    class PluginHost extends Core.EventDispatcher {
        public events: string[];
        public plugins: Core.IPlugin[];
        public paths: string[];
        public game: Core.BaseGame;
        constructor(instance: Core.BaseGame);
        public doReload(): void;
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
        _prototype: any;
    }
}
declare module HG.Resource {
    interface IFiletype {
        load(path: string, ...args: any[]): any;
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
        public hgLocale: string;
        public graphics: {
            fullscreen: boolean;
            fov: number;
            viewDistance: number;
            shadowMapSize: number;
            useStaticFramerate: boolean;
            staticFramerate: number;
            antialiasing: boolean;
            resolution: THREE.Vector2;
        };
        public sound: {
            masterVolume: number;
            channels: {
                effectsEnvVolume: number;
                effectsSelfVolume: number;
                musicVolume: number;
            };
        };
        public keys: {
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
        private _fps;
        constructor();
        public FPS : number;
        public maxFPS : number;
        public frameTime : number;
        public frame(delta: number): void;
    }
}
declare module HG.Utils {
    var KEY_MAP: {
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
    }
}
declare module HG.Utils {
    class Noise {
        static perm: number[];
        static generate2(x: number, y: number): number;
        static generate3(x: number, y: number, z: number): number;
        static Mod(x: number, m: number): number;
        static grad1(hash: number, x: number): number;
        static grad2(hash: number, x: number, y: number): number;
        static grad3(hash: number, x: number, y: number, z: number): number;
        static grad4(hash: number, x: number, y: number, z: number, t: number): number;
    }
}
declare module HG {
    var settings: Utils.ISettings;
}
declare module HG.Utils {
    var defaultSettings: ISettings;
}
declare module HG.Utils {
    function rgbToHex(r: number, g: number, b: number): number;
    function isFunction(va: any): boolean;
    function isUndefined(va: any): boolean;
    function isNumber(va: any): boolean;
    function bootstrap(game: HG.Core.BaseGame): void;
    function devTools(): void;
    function profile(label: string, fn: () => any): void;
    function time(label: string, fn: () => any): void;
    function hasGL(): boolean;
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
        public hosts: HG.Entities.BaseEntity[];
        public setHost(entity: HG.Entities.BaseEntity): void;
        public checkCompatibility(entity: HG.Entities.BaseEntity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Scenes {
    class BaseScene {
        public scene: Physijs.Scene;
        public cameraEntity: HG.Entities.CameraEntity;
        public controls: HG.Core.InputHandler;
        public entities: {
            named: {};
            unnamed: HG.Entities.BaseEntity[];
        };
        constructor();
        public add(entity: HG.Entities.BaseEntity, nameTag?: string): void;
        public camera(cam: HG.Entities.CameraEntity): void;
        public merge(otherScene: BaseScene): void;
        public resize(ratio: number): void;
        public getAllNamed(type?: any): any[];
        public getAllUnnamed(type?: any): any[];
        public getAll(type?: any): any[];
        public forNamed(callback: (e: any, k: string) => any, type?: any): void;
        public forUnamed(callback: (e: any) => any, type?: any): void;
        public forAll(callback: (e: any) => any, type?: any): void;
        public getInternal(): Physijs.Scene;
        public getCamera(): THREE.PerspectiveCamera;
        public frame(delta: number): void;
    }
}
declare module HG.Utils {
    interface IOptions {
        silent: boolean;
    }
}
declare module HG {
    var _start: number;
    var _gl: boolean;
    var _options: Utils.IOptions;
    function warn(...data: any[]): string;
    function forceLog(...data: any[]): string;
    function log(...data: any[]): string;
    function horrible(options?: Utils.IOptions): any;
}
declare var $: any;
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
        public checkCompatibility(entity: HG.Entities.BaseEntity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class MovingAbility extends Abilities.BaseAbility {
        public moveLeft(step: number): void;
        public moveRight(step: number): void;
        public lower(step: number): void;
        public turnLeft(step: number): void;
        public turnRight(step: number): void;
        public moveForward(step: number): void;
        public moveBackward(step: number): void;
        public frame(delta: number): void;
    }
}
declare module HG.Core {
    class BaseGame extends Core.EventDispatcher {
        public renderer: THREE.WebGLRenderer;
        public soundMixer: HG.Sound.Mixer;
        public currentScene: HG.Scenes.BaseScene;
        public pluginHost: Core.PluginHost;
        public controls: Core.InputHandler;
        public fpsCounter: HG.Utils.FPSCounter;
        public _running: boolean;
        public events: string[];
        constructor(container: HTMLElement);
        public title : any[];
        public scene(scene: HG.Scenes.BaseScene): void;
        public screenshot(path: string, imageType?: string): void;
        public load(): void;
        public resize(resolution: THREE.Vector2): void;
        public position(position: THREE.Vector2): void;
        public setFullScreenMode(state: boolean): void;
        public reload(): void;
        public toggleFullScreenMode(): void;
        public openDevConsole(): void;
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
        public clients: Core.ServerConnection[];
        constructor(port: number);
        public broadcast(message: any, sender?: Core.ServerConnection): void;
        public onSocket(socket: any): void;
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
declare module HG.Core {
    class ServerConnection extends Core.EventDispatcher {
        public socket: any;
        constructor(socket: any);
        public write: any;
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
        public getInternal(): THREE.PerspectiveCamera;
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
        public pitchObject: THREE.Object3D;
        public yawObject: THREE.Object3D;
        public velocity: THREE.Vector3;
        public PI_2: number;
        constructor(fov?: number, aspect?: number, zNear?: number, zFar?: number);
        public onMouseMove(x: number, y: number): void;
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
    class SpriteEntity extends Entities.BaseEntity {
        public object: THREE.Sprite;
        public alignment: THREE.Vector2;
        constructor(canvas?: HTMLCanvasElement, alignment?: THREE.Vector2);
        public load(texture: THREE.Texture): void;
    }
}
declare module HG.Entities {
    class VideoEntity extends Entities.BaseEntity {
        constructor(url?: string);
    }
}
declare module HG.LINQ {
    class ArrayProvider implements LINQ.IProvider {
        public _prototype: any[];
        public where(context: any[], query: (e: any) => boolean): any[];
        public order(context: any[], order: (a: any, b: any) => any): any[];
        public select(context: any[], selector: (e: any) => any): any[];
    }
}
declare module HG.LINQ {
    function initialize(): void;
}
declare module HG.LINQ {
    class NumberProvider implements LINQ.IProvider {
        public _prototype: Number;
        public toRadian(nmb: number): number;
        public toDegrees(nmb: number): number;
    }
}
declare module HG.LINQ {
    class ObjectProvider implements LINQ.IProvider {
        public _prototype: Object;
    }
}
declare module HG.LINQ {
    class StringProvider implements LINQ.IProvider {
        public _prototype: String;
        public format(context: string, arg1: any, ...args: any[]): string;
        public f: (context: string, arg1: any, ...args: any[]) => string;
        public log(context: string): void;
        public warn(context: string): void;
        public error(context: string): void;
        public lengthen(context: string, length: number, filler?: string): string;
        public replaceAll(context: string, find: RegExp, replace: string): string;
        public replaceAll(context: string, find: string, replace: string): string;
    }
}
declare module HG {
    var locale: Locale.LocaleDefinition;
}
declare module HG.Locale {
    class Locale {
    }
}
declare module HG.Locale {
    interface LocaleDefinition {
        core: {
            errors: {
                notImplementedError: string;
                duplicateNameTag: string;
                defaultSettingsUsed: string;
            };
        };
        event: {
            eventNotAvailable: string;
            eventAdded: string;
            isEmpty: string;
            injected: string;
        };
        linq: {
            provided: string;
        };
        resource: {
            noLoader: string;
            loaderFailure: string;
        };
        pluginHost: {
            failure: string;
            success: string;
        };
        settings: {
            loadedSuccess: string;
            loadedFailure: string;
            savedSuccess: string;
        };
        utils: {
            updateChecker: {
                newThree: string;
                noThree: string;
            };
        };
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
        private load(relPath, namespace, target);
        public model(path: string, entitiy: HG.Entities.MeshEntity): void;
        public texture(path: string, entitiy: HG.Entities.BaseEntity): void;
        public sound(path: string, effect: HG.Sound.Effect): void;
        public scene(path: string): HG.Scenes.BaseScene;
        public json<T>(path: string): T;
        public settings(path: string): void;
        public directory(directory: string): string[];
    }
}
declare module HG.Resource.Sound {
    class WAV extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Resource.Texture {
    class PNG extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Scenes {
    class GameScene extends Scenes.BaseScene {
    }
}
declare module HG.Scenes {
    class SceneSerializer extends HG.Core.EventDispatcher {
        public defaultPosition: number[];
        public defaultRotation: number[];
        public defaultOffset: number[];
        public defaultScale: number[];
        public fromGeneric(gen: any, loader: HG.Resource.ResourceLoader): Scenes.BaseScene;
    }
}
declare module HG.Sound {
    class Channel extends HG.Core.EventDispatcher {
        public name: string;
        public rootContext: AudioContext;
        public gainNode: GainNode;
        private children;
        public gain : number;
        constructor(name: string);
        public effect(): Sound.Effect;
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
        public volume(gain: number): void;
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
declare module HG.Utils {
    class CanvasUtils {
        static roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void;
    }
}
declare module HG.Utils {
    class UpdateChecker {
        public threeUrl: string;
        constructor();
        public downloadString(url: string, fn: (res: any) => any): void;
        public checkThree(onNew: (downloadUrl: string, version: string) => any, noNew: (version: string) => any): void;
    }
}
