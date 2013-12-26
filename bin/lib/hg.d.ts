/// <reference path="../../src/lib/LINQ.d.ts" />
/// <reference path="../../src/lib/lib.d.ts" />
/// <reference path="../../src/lib/node.d.ts" />
/// <reference path="../../src/lib/physijs.d.ts" />
/// <reference path="../../src/lib/three.d.ts" />
/// <reference path="../../src/lib/waa.d.ts" />
declare module HG.Core {
    class EventDispatcher {
        private _events;
        private _globalEvents;
        public events: string[];
        constructor(events?: string[]);
        private resolve(raw);
        public concat(otherDispatcher: EventDispatcher): EventDispatcher;
        public every(eventHandler: (...args: any[]) => any): EventDispatcher;
        public on(name: any, eventHandler?: Function): EventDispatcher;
        public bind: (name: any, eventHandler?: Function) => EventDispatcher;
        public addEventListener: (name: any, eventHandler?: Function) => EventDispatcher;
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
        public load(path: string[], env?: {
            HG: any;
            THREE: any;
            game: Core.BaseGame;
            window: Window;
            document: Document;
        }): void;
    }
}
declare module HG.Core {
    class IPlugin {
        public name: string;
        constructor(host: Core.PluginHost, env: {
            HG: any;
            THREE: any;
            game: Core.BaseGame;
            window: Window;
            document: Document;
        });
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
        load(data: any): void;
    }
}
declare module HG.Utils {
    class ISettings {
        public debug: boolean;
        public hgLocale: string;
        public graphics: {
            fullscreen: boolean;
            fov: number;
            aa: number;
            viewDistance: number;
            shadowMapSize: number;
            useStaticFramerate: boolean;
            staticFramerate: number;
            antialiasing: boolean;
            resolution: THREE.Vector2;
            devToolsResolution: THREE.Vector2;
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
        public set(data: T, x?: number, y?: number, z?: number): boolean;
        public get(x?: number, y?: number, z?: number, fallback?: any): T;
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
    function parseColor(raw: any): THREE.Color;
    function isFunction(va: any): boolean;
    function isNumber(va: any): boolean;
    function devTools(): any;
    function profile(label: string, fn: () => any): void;
    function time(label: string, fn: () => any): void;
    function hasGL(): boolean;
}
declare module HG.Utils {
    class CanvasUtils {
        static roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void;
    }
}
declare module HG.Utils {
    class UpdateChecker {
        public threeUrl: string;
        public nwUrl: string;
        constructor();
        public downloadString(url: string, fn: (res: any) => any): void;
        public checkThree(onNew: (downloadUrl: string, version: string) => any, noNew: (version: string) => any): void;
    }
}
declare module HG.Utils {
    interface GameStartParameters {
        input: boolean;
        profileFrame: boolean;
        noResize: boolean;
    }
}
declare module HG.Utils {
    function queue<T>(functions: Function[], done: (allData: T[]) => void): void;
}
declare module HG.Utils {
    class Tween {
        public timeArray: any[];
        public valueArray: any[];
        constructor(timeArray?: any[], valueArray?: any[]);
        public lerp(t: number): any;
    }
}
declare module HG.Entities {
    class Entity extends HG.Core.EventDispatcher implements HG.Resource.ILoadable {
        public abilities: HG.Abilities.Ability[];
        public object: THREE.Object3D;
        public name: string;
        public positionOffset: THREE.Vector3;
        public velocity: THREE.Vector3;
        constructor(object?: THREE.Object3D);
        public ability(a: HG.Abilities.Ability): boolean;
        public forAbilities(callback: (a: HG.Abilities.Ability) => void): void;
        public offset(x: number, y: number, z: number): Entity;
        public load(data: any): void;
        public scale(x: number, y?: number, z?: number): Entity;
        public position(x: number, y?: number, z?: number): Entity;
        public rotate(x: number, y: number, z: number): Entity;
        public getInternal(): THREE.Object3D;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class Ability extends HG.Core.EventDispatcher {
        public host: HG.Entities.Entity;
        public setHost(entity: HG.Entities.Entity): void;
        public checkCompatibility(entity: HG.Entities.Entity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Core {
    class Scene {
        public scene: Physijs.Scene;
        public cameras: Core.Collection<HG.Entities.CameraEntity>;
        public entities: Core.Collection<HG.Entities.Entity>;
        public controls: Core.InputHandler;
        public selectedCamera: string;
        public color: THREE.Color;
        public colorAlpha: number;
        public startTime: number;
        constructor();
        public push(entity: HG.Entities.Entity): void;
        public concat(otherScene: Scene): Scene;
        public onResize(ratio: number): void;
        public camera(name: string): boolean;
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
declare var query: any;
declare module HG.Abilities {
    class AnimationAbility extends Abilities.Ability {
        public animOffset: number;
        public running: boolean;
        public duration: number;
        public keyframes: number;
        public interpolation: number;
        public lastKeyframe: number;
        public currentKeyframe: number;
        public events: string[];
        constructor(options: {
            offset: number;
            duration: number;
            keyframes: number;
        });
        public run(): void;
        public checkCompatibility(entity: HG.Entities.Entity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Abilities {
    class AudioAbility extends Abilities.Ability {
        public audioEffect: HG.Sound.Effect;
        constructor(options: {
            effect: HG.Sound.Effect;
        });
        public play(): void;
    }
}
declare module HG.Abilities {
    class MovingAbility extends Abilities.Ability {
        public baseStep: number;
        constructor(baseStep: number);
        public moveLeft(delta: number): void;
        public moveRight(delta: number): void;
        public lower(delta: number): void;
        public turnLeft(delta: number): void;
        public turnRight(delta: number): void;
        public moveForward(delta: number): void;
        public moveBackward(delta: number): void;
    }
}
declare module HG.Abilities {
    class ScriptExecuteAbility extends Abilities.Ability {
        public events: string[];
        constructor();
        public checkCompatibility(entity: HG.Entities.Entity): boolean;
        public frame(delta: number): void;
    }
}
declare module HG.Core {
    class ArrayKey<K, T> {
        private values;
        private keys;
        constructor();
        public forEach(fn: (value: T, index: number, key: K) => any): void;
        public push(key: K, value: T): void;
        public set(key: K, value: T): boolean;
        public has(key: K): boolean;
        public concat(...args: ArrayKey<K, T>[]): ArrayKey<K, T>;
        public value(v: T): K;
        public key(k: K): T;
    }
}
declare module HG.Core {
    class BaseGame extends Core.EventDispatcher {
        public renderer: THREE.WebGLRenderer;
        public resolution: THREE.Vector2;
        public soundMixer: HG.Sound.Mixer;
        public currentScene: Core.Scene;
        public pluginHost: Core.PluginHost;
        public controls: Core.InputHandler;
        public fpsCounter: HG.Utils.FPSCounter;
        public params: HG.Utils.GameStartParameters;
        public container: HTMLElement;
        public startTime: number;
        public _running: boolean;
        public events: string[];
        constructor(container: HTMLElement);
        public title : any;
        public lockMouse(): void;
        public scene(scene: Core.Scene): void;
        public screenshot(path: string, imageType?: string): void;
        public load(): void;
        public resize(resolution: THREE.Vector2): void;
        public position(position: THREE.Vector2): void;
        public setFullScreenMode(state: boolean): void;
        public reload(): void;
        public toggleFullScreenMode(): void;
        public start(params: HG.Utils.GameStartParameters): void;
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
    class Collection<T extends { name?: string; }> {
        public named: {};
        public unNamed: T[];
        public push(item: T, name?: string): void;
        public concat(otherCollection: Collection<T>): Collection<T>;
        public has(name: string): boolean;
        public getAllNamed(): T[];
        public getAllUnnamed(): T[];
        public getAll(): T[];
        public forNamed(callback: (e: any, k: string) => any): void;
        public forUnamed(callback: (e: any) => any): void;
        public forEach(callback: (e: any, i: any, ...args: any[]) => any): void;
        public get(name: string): T;
        public forAll(callback: (e: any) => any): void;
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
        public concat(otherHandler: InputHandler): InputHandler;
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
    class Shader {
        public vertex: string;
        public fragment: string;
    }
}
declare module HG.Entities {
    class CameraEntity extends Entities.Entity {
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
        public _target: Entities.MeshEntity;
        public target : Entities.MeshEntity;
        constructor(target: Entities.MeshEntity, fov?: number, aspect?: number, zNear?: number, zFar?: number);
        public frame(delta: number): void;
    }
}
declare module HG.Entities {
    class FirstPersonCameraEntity extends Entities.CameraEntity {
        public object: THREE.PerspectiveCamera;
        public target: THREE.Object3D;
        public isOnObject: boolean;
        public canJump: boolean;
        public PI_2: number;
        constructor(fov?: number, aspect?: number, zNear?: number, zFar?: number);
        public onMouseMove(x: number, y: number): void;
        public setViewDistance(distance: number): void;
        public frame(delta: number): void;
    }
}
declare module HG.Entities {
    class HeightMapEntity extends Entities.Entity {
        constructor(directory: string, size?: number, directions?: string[], suffix?: string);
    }
}
declare module HG.Entities {
    class MeshEntity extends Entities.Entity implements HG.Resource.ILoadable {
        public object: THREE.Mesh;
        public events: string[];
        public load(data: {
            material: any;
            geometry: THREE.Geometry;
        }): void;
    }
}
declare module HG.Entities {
    class ParticleEntity extends Entities.Entity {
        public count: number;
        public size: number;
        public color: number;
        public map: string;
        constructor(map: string, count?: number, size?: number);
        public create(): void;
    }
}
declare module HG.Entities {
    class SkyBoxEntity extends Entities.Entity {
        constructor(textures: THREE.Texture[], order?: string[], size?: number);
    }
}
declare module HG.Entities {
    class SpriteEntity extends Entities.Entity {
        public object: THREE.Sprite;
        public alignment: THREE.Vector2;
        constructor(canvas?: HTMLCanvasElement, alignment?: THREE.Vector2);
        public load(texture: THREE.Texture): void;
    }
}
declare module HG.Entities {
    class TextEntity extends Entities.Entity {
        public object: THREE.Mesh;
        public texture: THREE.Texture;
        public _text: string;
        public _font: string;
        public _fillStyle: string;
        public context: CanvasRenderingContext2D;
        public text : string;
        public font : string;
        public fillStyle : string;
        constructor(text?: string);
        public reDraw(): void;
    }
}
declare module HG.Entities {
    class VideoEntity extends Entities.Entity {
        public domElement: HTMLVideoElement;
        public videoTexture: THREE.Texture;
        public videoImageContext: CanvasRenderingContext2D;
        constructor(domElement: HTMLVideoElement);
        public play(): void;
        public pause(): void;
        public stop(): void;
        public rewind(): void;
        public frame(delta: number): void;
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
    class FunctionProvider implements LINQ.IProvider {
        public _prototype: Function;
    }
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
        errors: {
            notImplementedError: string;
            nullReferenceError: string;
            duplicateNameTagError: string;
            defaultSettingsUsedWarning: string;
            fileNotExisting: string;
            keyNotExistend: string;
            valueNotExistend: string;
        };
        debug: {
            geometries: string;
            programs: string;
            textures: string;
            calls: string;
            faces: string;
            points: string;
            vertices: string;
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
declare module HG.Resource {
    enum CacheResults {
        Added = 0,
        AlreadyExists = 1,
        Updated = 2,
        Failure = 3,
    }
    class Cache {
        public loader: Resource.ResourceLoader;
        public files: HG.Core.ArrayKey<any, string>;
        constructor(loader: Resource.ResourceLoader);
        public cache(path: string, data?: any): CacheResults;
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
        public cache: Resource.Cache;
        constructor(baseDirectory: string);
        public path(path: string, silent?: boolean): string;
        private load(relPath, namespace, loaderArgs);
        public model(path: string, ...args: any[]): HG.Core.EventDispatcher;
        public sound(path: string, ...args: any[]): HG.Core.EventDispatcher;
        public video(path: string, ...args: any[]): HG.Core.EventDispatcher;
        public texture(path: string): THREE.Texture;
        public queueTexture(paths: string[], done: (textures: THREE.Texture[]) => void): void;
        public scene(path: string, done: (scene: HG.Core.Scene) => void): void;
        public queueScene(paths: string[], done: (scenes: HG.Core.Scene[]) => void): void;
        public queueJSON<T>(paths: string[], done: (scenes: T[]) => void): void;
        public shader(path: string): {
            vertex: string;
            fragment: string;
            extend: Function;
        };
        public json<T>(path: string, data?: T): T;
        public directory(directory: string, extension?: string): string[];
    }
}
declare module HG.Resource.Sound {
    class WAV extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Resource.Video {
    class OGV extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Core.Serializer {
    interface AbilityDefinition {
        type: string;
        properties?: any[];
        bindings?: {
            keyboard?: Serializer.BindingDefinition[];
            mouse?: Serializer.BindingDefinition[];
        };
    }
}
declare module HG.Core.Serializer {
    interface BindingDefinition {
        event: string;
        action: string;
        properties?: any[];
    }
}
declare module HG.Core.Serializer {
    interface EntityDefinition {
        type: string;
        properties: any[];
        abilities?: Serializer.AbilityDefinition[];
        object: Serializer.ObjectDefinition;
        material?: Serializer.MaterialDefinition;
        geometry?: Serializer.ObjectDefinition;
        shader?: Serializer.ShaderDefinition;
        name?: string;
        model?: string;
        scale?: number[];
        position?: number[];
        offset?: number[];
        rotation?: number[];
    }
}
declare module HG.Core.Serializer {
    class EntityParser extends Core.EventDispatcher {
        public scene: Core.Scene;
        public loader: HG.Resource.ResourceLoader;
        public defaultPosition: number[];
        public defaultRotation: number[];
        public defaultOffset: number[];
        public defaultScale: number[];
        constructor(scene: Core.Scene, loader: HG.Resource.ResourceLoader);
        private parseMaterials(raw, scene);
        private parseGeometry(raw, scene);
        private parseSingleMaterial(raw, scene);
        private parseShader(raw, scene);
        private parseAbilities(raw, entity, scene);
        private setup(raw, entity);
        private parseArray(raw, length?);
        private applyConstructor(type, argArray);
        private parseProperties(raw, scene);
        private parseProperty(raw, scene);
        public parse(rawEntity: Serializer.EntityDefinition): void;
    }
}
declare module HG.Core.Serializer {
    interface MaterialDefinition {
        type: string;
        properties?: any[];
        color?: number[];
        texture?: string;
    }
}
declare module HG.Core.Serializer {
    interface ObjectDefinition {
        type: string;
        properties?: any[];
    }
}
declare module HG.Core.Serializer {
    interface RawShaderDefinition {
        vertex: string;
        fragment: string;
        meta: {
            type: string;
            properties: {};
        };
    }
}
declare module HG.Core.Serializer {
    interface SceneDefinition {
        camera: Serializer.EntityDefinition;
        color?: number[];
        initialCamera: string;
        colorAlpha: number;
        entities: Serializer.EntityDefinition[];
    }
}
declare module HG.Core.Serializer {
    class SceneSerializer extends Core.EventDispatcher {
        public loader: HG.Resource.ResourceLoader;
        public done: number;
        constructor(loader: HG.Resource.ResourceLoader);
        public fromGeneric(generic: any): void;
    }
}
declare module HG.Core.Serializer {
    interface ShaderDefinition {
        type: string;
        properties: {};
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
    class Effect extends HG.Core.EventDispatcher implements HG.Resource.ILoadable {
        public name: string;
        public gainNode: GainNode;
        public destination: Sound.Channel;
        public source: AudioBufferSourceNode;
        public buffer: AudioBuffer;
        public rootContext: AudioContext;
        constructor(ch: Sound.Channel);
        public load(data: AudioBuffer): void;
        public play(): void;
        public stop(): void;
        public volume(gain: number): void;
    }
}
declare module HG.Sound {
    class Mixer {
        public channels: HG.Core.Collection<Sound.Channel>;
        public gainNode: GainNode;
        public context: AudioContext;
        constructor();
        public gain : number;
        public channel(name: string): Sound.Channel;
        public volume(gain: number): void;
        public addChannel(ch: Sound.Channel): void;
    }
}
