/// <reference path="../../src/defs/LINQ.d.ts" />
/// <reference path="../../src/defs/WebGL.d.ts" />
/// <reference path="../../src/defs/gamepad.d.ts" />
/// <reference path="../../src/defs/lib.d.ts" />
/// <reference path="../../src/defs/node.d.ts" />
/// <reference path="../../src/defs/physijs.d.ts" />
/// <reference path="../../src/defs/three.d.ts" />
/// <reference path="../../src/defs/waa.d.ts" />
declare module HG.Core {
    class EventDispatcher {
        private _events;
        private _globalEvents;
        public events: string[];
        public silent: boolean;
        constructor(events?: string[], silent?: boolean);
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
    var ui: any;
}
declare module HG.Core {
    class IPlugin {
        public name: string;
        constructor(host: Core.PluginHost, env: Core.PluginEnv);
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
            anisotropy: number;
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
        mouseLock: boolean;
        noResize: boolean;
    }
}
declare module HG.Utils {
    function queue<K, T>(functions: HG.Core.Hash<K, Function>, done: (data: HG.Core.Hash<K, T>) => void): void;
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
        public controls: HG.Input.Handler;
        public selectedCamera: string;
        public color: THREE.Color;
        public colorAlpha: number;
        public startTime: number;
        public unnamedCount: number;
        public fog : THREE.Fog;
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
    class MovingAbility extends Abilities.Ability {
        public baseStep: number;
        constructor(baseStep: number);
        public moveLeft(delta: number): void;
        public moveRight(delta: number): void;
        public lower(delta: number): void;
        public jump(delta: number): void;
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
    class BaseGame extends Core.EventDispatcher {
        public renderer: THREE.WebGLRenderer;
        public resolution: THREE.Vector2;
        public soundMixer: HG.Sound.Mixer;
        public currentScene: Core.Scene;
        public pluginHost: Core.PluginHost;
        public controls: HG.Input.Handler;
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
        public named: Core.Hash<string, T>;
        public unNamed: T[];
        public push(item: T, name?: string): void;
        public concat(otherCollection: Collection<T>): Collection<T>;
        public has(name: string): boolean;
        public getAllNamed(): T[];
        public getAllUnnamed(): T[];
        public getAll(): T[];
        public forNamed(callback: (v: T, k?: any, i?: any) => any): void;
        public forUnamed(callback: (v: T, k?: any, i?: any) => any): void;
        public forEach(callback: (v: T, k?: any, i?: any) => any): void;
        public get(name: string): T;
        public forAll(callback: (e: any) => any): void;
    }
}
declare module HG.Core {
    class Hash<K, T> {
        private keys;
        private values;
        constructor();
        public length : number;
        public forEach(fn: (value: T, key: K, index: number) => any): Hash<K, T>;
        public push(key: K, value: T): Hash<K, T>;
        public toValueArray(): T[];
        public toKeyArray(): K[];
        static fromNative<NK, NT>(native: {}): Hash<NK, NT>;
        public toNativeHash(): {};
        public set(key: K, value: T): boolean;
        public indexOf(key: K): number;
        public has(key: K): boolean;
        public concat(...args: Hash<K, T>[]): Hash<K, T>;
        public index(index: number): {
            key: K;
            value: T;
        };
        public value(v: T): K;
        public key(k: K): T;
    }
}
declare module HG.Core {
    interface PluginEnv {
        HG: any;
        THREE: any;
        game: Core.BaseGame;
        window: Window;
        document: Document;
    }
    class PluginHost extends Core.EventDispatcher {
        public events: string[];
        public plugins: Core.IPlugin[];
        public paths: string[];
        public game: Core.BaseGame;
        constructor(instance: Core.BaseGame);
        public load(path: string[], env?: PluginEnv): void;
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
        public uniforms: Core.Hash<string, any>;
        constructor(vertex: string, fragment: string);
        public toMaterial(): THREE.ShaderMaterial;
        public set(key: string, data: any): Shader;
        public extend(obj: Core.Hash<string, any>): Shader;
        public extendTexture(textures: Core.Hash<string, THREE.Texture>): Shader;
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
    class MeshEntity extends Entities.Entity implements HG.Resource.ILoadable {
        public object: THREE.Mesh;
        public events: string[];
        constructor(geometry?: THREE.Geometry, material?: THREE.Material);
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
        constructor(textures: HG.Core.Hash<string, THREE.Texture>, size?: number);
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
declare module HG.Input {
    class GamepadDevice extends HG.Core.EventDispatcher implements Input.IDevice {
        public last: Gamepad;
        public raw: Gamepad;
        public id: number;
        constructor(id: number);
        public frame(delta: number): void;
    }
}
declare module HG.Input {
    enum DEVICE {
        KEYBOARD = 0,
        MOUSE = 1,
        GAMEPAD = 3,
    }
    class Binding {
        public device: DEVICE;
        public keyCode: number;
        public handler: Function;
    }
    class Handler {
        public mouse: Input.MouseDevice;
        public keyboard: Input.KeyboardDevice;
        public gamepad: Input.GamepadDevice[];
        constructor();
        public frame(delta: number): void;
        public onMouseMove(e: MouseEvent): void;
        public onMouseDown(e: MouseEvent): void;
        public onMouseUp(e: MouseEvent): void;
        public onKeyDown(e: KeyboardEvent): void;
        public onKeyUp(e: KeyboardEvent): void;
    }
}
declare module HG.Input {
    interface IDevice {
        onKeyDown?: (e: KeyboardEvent) => void;
        onKeyUp?: (e: KeyboardEvent) => void;
        onMouseDown?: (e: MouseEvent) => void;
        onMouseUp?: (e: MouseEvent) => void;
        onMouseMove?: (e: MouseEvent) => void;
        frame: (delta: number) => void;
    }
}
declare module HG.Input {
    class KeyboardDevice extends HG.Core.EventDispatcher implements Input.IDevice {
        private keyState;
        constructor();
        public onKeyDown(e: KeyboardEvent): void;
        public onKeyUp(e: KeyboardEvent): void;
        public frame(delta: number): void;
    }
}
declare module HG.Input {
    class MouseDevice extends HG.Core.EventDispatcher implements Input.IDevice {
        private mouseState;
        private cursorPosition;
        constructor();
        public onMouseMove(e: MouseEvent): void;
        public onMouseDown(e: MouseEvent): void;
        public onMouseUp(e: MouseEvent): void;
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
        public contains(context: string, contains: string): boolean;
        public lengthen(context: string, length: number, filler?: string): string;
        public replaceAll(context: string, find: RegExp, replace: string): string;
        public replaceAll(context: string, find: string, replace: string): string;
    }
}
declare module HG {
    var locale: Locale.LocaleDefinition;
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
declare module HG.Platform {
    interface IPlatformGLObject {
    }
    interface IPlatformGLBuffer extends IPlatformGLObject {
    }
    interface IPlatformGLFramebuffer extends IPlatformGLObject {
    }
    interface IPlatformGLProgram extends IPlatformGLObject {
    }
    interface IPlatformGLRenderbuffer extends IPlatformGLObject {
    }
    interface IPlatformGLShader extends IPlatformGLObject {
    }
    interface IPlatformGLTexture extends IPlatformGLObject {
    }
    interface IPlatformGLUniformLocation {
    }
    interface IPlatformGLActiveInfo {
        size: number;
        type: number;
        name: string;
    }
    interface IPlatformGLShaderPrecisionFormat {
        rangeMin: number;
        rangeMax: number;
        precision: number;
    }
    interface IPlatformGLContextAttributes {
        alpha: boolean;
        depth: boolean;
        stencil: boolean;
        antialias: boolean;
        premultipliedAlpha: boolean;
        preserveDrawingBuffer: boolean;
    }
    interface IPlatformGLContext {
        DEPTH_BUFFER_BIT: number;
        STENCIL_BUFFER_BIT: number;
        COLOR_BUFFER_BIT: number;
        POINTS: number;
        LINES: number;
        LINE_LOOP: number;
        LINE_STRIP: number;
        TRIANGLES: number;
        TRIANGLE_STRIP: number;
        TRIANGLE_FAN: number;
        ZERO: number;
        ONE: number;
        SRC_COLOR: number;
        ONE_MINUS_SRC_COLOR: number;
        SRC_ALPHA: number;
        ONE_MINUS_SRC_ALPHA: number;
        DST_ALPHA: number;
        ONE_MINUS_DST_ALPHA: number;
        DST_COLOR: number;
        ONE_MINUS_DST_COLOR: number;
        SRC_ALPHA_SATURATE: number;
        FUNC_ADD: number;
        BLEND_EQUATION: number;
        BLEND_EQUATION_RGB: number;
        BLEND_EQUATION_ALPHA: number;
        FUNC_SUBTRACT: number;
        FUNC_REVERSE_SUBTRACT: number;
        BLEND_DST_RGB: number;
        BLEND_SRC_RGB: number;
        BLEND_DST_ALPHA: number;
        BLEND_SRC_ALPHA: number;
        CONSTANT_COLOR: number;
        ONE_MINUS_CONSTANT_COLOR: number;
        CONSTANT_ALPHA: number;
        ONE_MINUS_CONSTANT_ALPHA: number;
        BLEND_COLOR: number;
        ARRAY_BUFFER: number;
        ELEMENT_ARRAY_BUFFER: number;
        ARRAY_BUFFER_BINDING: number;
        ELEMENT_ARRAY_BUFFER_BINDING: number;
        STREAM_DRAW: number;
        STATIC_DRAW: number;
        DYNAMIC_DRAW: number;
        BUFFER_SIZE: number;
        BUFFER_USAGE: number;
        CURRENT_VERTEX_ATTRIB: number;
        FRONT: number;
        BACK: number;
        FRONT_AND_BACK: number;
        CULL_FACE: number;
        BLEND: number;
        DITHER: number;
        STENCIL_TEST: number;
        DEPTH_TEST: number;
        SCISSOR_TEST: number;
        POLYGON_OFFSET_FILL: number;
        SAMPLE_ALPHA_TO_COVERAGE: number;
        SAMPLE_COVERAGE: number;
        NO_ERROR: number;
        INVALID_ENUM: number;
        INVALID_VALUE: number;
        INVALID_OPERATION: number;
        OUT_OF_MEMORY: number;
        CW: number;
        CCW: number;
        LINE_WIDTH: number;
        ALIASED_POINT_SIZE_RANGE: number;
        ALIASED_LINE_WIDTH_RANGE: number;
        CULL_FACE_MODE: number;
        FRONT_FACE: number;
        DEPTH_RANGE: number;
        DEPTH_WRITEMASK: number;
        DEPTH_CLEAR_VALUE: number;
        DEPTH_FUNC: number;
        STENCIL_CLEAR_VALUE: number;
        STENCIL_FUNC: number;
        STENCIL_FAIL: number;
        STENCIL_PASS_DEPTH_FAIL: number;
        STENCIL_PASS_DEPTH_PASS: number;
        STENCIL_REF: number;
        STENCIL_VALUE_MASK: number;
        STENCIL_WRITEMASK: number;
        STENCIL_BACK_FUNC: number;
        STENCIL_BACK_FAIL: number;
        STENCIL_BACK_PASS_DEPTH_FAIL: number;
        STENCIL_BACK_PASS_DEPTH_PASS: number;
        STENCIL_BACK_REF: number;
        STENCIL_BACK_VALUE_MASK: number;
        STENCIL_BACK_WRITEMASK: number;
        VIEWPORT: number;
        SCISSOR_BOX: number;
        COLOR_CLEAR_VALUE: number;
        COLOR_WRITEMASK: number;
        UNPACK_ALIGNMENT: number;
        PACK_ALIGNMENT: number;
        MAX_TEXTURE_SIZE: number;
        MAX_VIEWPORT_DIMS: number;
        SUBPIXEL_BITS: number;
        RED_BITS: number;
        GREEN_BITS: number;
        BLUE_BITS: number;
        ALPHA_BITS: number;
        DEPTH_BITS: number;
        STENCIL_BITS: number;
        POLYGON_OFFSET_UNITS: number;
        POLYGON_OFFSET_FACTOR: number;
        TEXTURE_BINDING_2D: number;
        SAMPLE_BUFFERS: number;
        SAMPLES: number;
        SAMPLE_COVERAGE_VALUE: number;
        SAMPLE_COVERAGE_INVERT: number;
        COMPRESSED_TEXTURE_FORMATS: number;
        DONT_CARE: number;
        FASTEST: number;
        NICEST: number;
        GENERATE_MIPMAP_HINT: number;
        BYTE: number;
        UNSIGNED_BYTE: number;
        SHORT: number;
        UNSIGNED_SHORT: number;
        INT: number;
        UNSIGNED_INT: number;
        FLOAT: number;
        DEPTH_COMPONENT: number;
        ALPHA: number;
        RGB: number;
        RGBA: number;
        LUMINANCE: number;
        LUMINANCE_ALPHA: number;
        UNSIGNED_SHORT_4_4_4_4: number;
        UNSIGNED_SHORT_5_5_5_1: number;
        UNSIGNED_SHORT_5_6_5: number;
        FRAGMENT_SHADER: number;
        VERTEX_SHADER: number;
        MAX_VERTEX_ATTRIBS: number;
        MAX_VERTEX_UNIFORM_VECTORS: number;
        MAX_VARYING_VECTORS: number;
        MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
        MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
        MAX_TEXTURE_IMAGE_UNITS: number;
        MAX_FRAGMENT_UNIFORM_VECTORS: number;
        SHADER_TYPE: number;
        DELETE_STATUS: number;
        LINK_STATUS: number;
        VALIDATE_STATUS: number;
        ATTACHED_SHADERS: number;
        ACTIVE_UNIFORMS: number;
        ACTIVE_ATTRIBUTES: number;
        SHADING_LANGUAGE_VERSION: number;
        CURRENT_PROGRAM: number;
        NEVER: number;
        LESS: number;
        EQUAL: number;
        LEQUAL: number;
        GREATER: number;
        NOTEQUAL: number;
        GEQUAL: number;
        ALWAYS: number;
        KEEP: number;
        REPLACE: number;
        INCR: number;
        DECR: number;
        INVERT: number;
        INCR_WRAP: number;
        DECR_WRAP: number;
        VENDOR: number;
        RENDERER: number;
        VERSION: number;
        NEAREST: number;
        LINEAR: number;
        NEAREST_MIPMAP_NEAREST: number;
        LINEAR_MIPMAP_NEAREST: number;
        NEAREST_MIPMAP_LINEAR: number;
        LINEAR_MIPMAP_LINEAR: number;
        TEXTURE_MAG_FILTER: number;
        TEXTURE_MIN_FILTER: number;
        TEXTURE_WRAP_S: number;
        TEXTURE_WRAP_T: number;
        TEXTURE_2D: number;
        TEXTURE: number;
        TEXTURE_CUBE_MAP: number;
        TEXTURE_BINDING_CUBE_MAP: number;
        TEXTURE_CUBE_MAP_POSITIVE_X: number;
        TEXTURE_CUBE_MAP_NEGATIVE_X: number;
        TEXTURE_CUBE_MAP_POSITIVE_Y: number;
        TEXTURE_CUBE_MAP_NEGATIVE_Y: number;
        TEXTURE_CUBE_MAP_POSITIVE_Z: number;
        TEXTURE_CUBE_MAP_NEGATIVE_Z: number;
        MAX_CUBE_MAP_TEXTURE_SIZE: number;
        TEXTURE0: number;
        TEXTURE1: number;
        TEXTURE2: number;
        TEXTURE3: number;
        TEXTURE4: number;
        TEXTURE5: number;
        TEXTURE6: number;
        TEXTURE7: number;
        TEXTURE8: number;
        TEXTURE9: number;
        TEXTURE10: number;
        TEXTURE11: number;
        TEXTURE12: number;
        TEXTURE13: number;
        TEXTURE14: number;
        TEXTURE15: number;
        TEXTURE16: number;
        TEXTURE17: number;
        TEXTURE18: number;
        TEXTURE19: number;
        TEXTURE20: number;
        TEXTURE21: number;
        TEXTURE22: number;
        TEXTURE23: number;
        TEXTURE24: number;
        TEXTURE25: number;
        TEXTURE26: number;
        TEXTURE27: number;
        TEXTURE28: number;
        TEXTURE29: number;
        TEXTURE30: number;
        TEXTURE31: number;
        ACTIVE_TEXTURE: number;
        REPEAT: number;
        CLAMP_TO_EDGE: number;
        MIRRORED_REPEAT: number;
        FLOAT_VEC2: number;
        FLOAT_VEC3: number;
        FLOAT_VEC4: number;
        INT_VEC2: number;
        INT_VEC3: number;
        INT_VEC4: number;
        BOOL: number;
        BOOL_VEC2: number;
        BOOL_VEC3: number;
        BOOL_VEC4: number;
        FLOAT_MAT2: number;
        FLOAT_MAT3: number;
        FLOAT_MAT4: number;
        SAMPLER_2D: number;
        SAMPLER_CUBE: number;
        VERTEX_ATTRIB_ARRAY_ENABLED: number;
        VERTEX_ATTRIB_ARRAY_SIZE: number;
        VERTEX_ATTRIB_ARRAY_STRIDE: number;
        VERTEX_ATTRIB_ARRAY_TYPE: number;
        VERTEX_ATTRIB_ARRAY_NORMALIZED: number;
        VERTEX_ATTRIB_ARRAY_POINTER: number;
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: number;
        COMPILE_STATUS: number;
        LOW_FLOAT: number;
        MEDIUM_FLOAT: number;
        HIGH_FLOAT: number;
        LOW_INT: number;
        MEDIUM_INT: number;
        HIGH_INT: number;
        FRAMEBUFFER: number;
        RENDERBUFFER: number;
        RGBA4: number;
        RGB5_A1: number;
        RGB565: number;
        DEPTH_COMPONENT16: number;
        STENCIL_INDEX: number;
        STENCIL_INDEX8: number;
        DEPTH_STENCIL: number;
        RENDERBUFFER_WIDTH: number;
        RENDERBUFFER_HEIGHT: number;
        RENDERBUFFER_INTERNAL_FORMAT: number;
        RENDERBUFFER_RED_SIZE: number;
        RENDERBUFFER_GREEN_SIZE: number;
        RENDERBUFFER_BLUE_SIZE: number;
        RENDERBUFFER_ALPHA_SIZE: number;
        RENDERBUFFER_DEPTH_SIZE: number;
        RENDERBUFFER_STENCIL_SIZE: number;
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: number;
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: number;
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: number;
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: number;
        COLOR_ATTACHMENT0: number;
        DEPTH_ATTACHMENT: number;
        STENCIL_ATTACHMENT: number;
        DEPTH_STENCIL_ATTACHMENT: number;
        NONE: number;
        FRAMEBUFFER_COMPLETE: number;
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT: number;
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: number;
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS: number;
        FRAMEBUFFER_UNSUPPORTED: number;
        FRAMEBUFFER_BINDING: number;
        RENDERBUFFER_BINDING: number;
        MAX_RENDERBUFFER_SIZE: number;
        INVALID_FRAMEBUFFER_OPERATION: number;
        UNPACK_FLIP_Y_WEBGL: number;
        UNPACK_PREMULTIPLY_ALPHA_WEBGL: number;
        CONTEXT_LOST_WEBGL: number;
        UNPACK_COLORSPACE_CONVERSION_WEBGL: number;
        BROWSER_DEFAULT_WEBGL: number;
        canvas: HTMLCanvasElement;
        drawingBufferWidth: number;
        drawingBufferHeight: number;
        isContextLost(): boolean;
        getContextAttributes(): IPlatformGLContextAttributes;
        getSupportedExtensions(): string[];
        getExtension(name: string): any;
        activeTexture(texture: number): void;
        attachShader(program: IPlatformGLProgram, shader: IPlatformGLShader): void;
        bindAttribLocation(program: IPlatformGLProgram, index: number, name: string): void;
        bindBuffer(target: number, buffer: IPlatformGLBuffer): void;
        bindFramebuffer(target: number, framebuffer: IPlatformGLFramebuffer): void;
        bindRenderbuffer(target: number, renderbuffer: IPlatformGLRenderbuffer): void;
        bindTexture(target: number, texture: IPlatformGLTexture): void;
        blendColor(red: number, green: number, blue: number, alpha: number): void;
        blendEquation(mode: number): void;
        blendEquationSeparate(modeRGB: number, modeAlpha: number): void;
        blendFunc(sfactor: number, dfactor: number): void;
        blendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number): void;
        bufferData(target: number, size: number, usage: number): void;
        bufferData(target: number, data: ArrayBufferView, usage: number): void;
        bufferData(target: number, data: ArrayBuffer, usage: number): void;
        bufferSubData(target: number, offset: number, data: ArrayBufferView): void;
        bufferSubData(target: number, offset: number, data: ArrayBuffer): void;
        checkFramebufferStatus(target: number): number;
        clear(mask: number): void;
        clearColor(red: number, green: number, blue: number, alpha: number): void;
        clearDepth(depth: number): void;
        clearStencil(s: number): void;
        colorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
        compileShader(shader: IPlatformGLShader): void;
        compressedTexImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, data: ArrayBufferView): void;
        compressedTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, data: ArrayBufferView): void;
        copyTexImage2D(target: number, level: number, internalformat: number, x: number, y: number, width: number, height: number, border: number): void;
        copyTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number): void;
        createBuffer(): IPlatformGLBuffer;
        createFramebuffer(): IPlatformGLFramebuffer;
        createProgram(): IPlatformGLProgram;
        createRenderbuffer(): IPlatformGLRenderbuffer;
        createShader(type: number): IPlatformGLShader;
        createTexture(): IPlatformGLTexture;
        cullFace(mode: number): void;
        deleteBuffer(buffer: IPlatformGLBuffer): void;
        deleteFramebuffer(framebuffer: IPlatformGLFramebuffer): void;
        deleteProgram(program: IPlatformGLProgram): void;
        deleteRenderbuffer(renderbuffer: IPlatformGLRenderbuffer): void;
        deleteShader(shader: IPlatformGLShader): void;
        deleteTexture(texture: IPlatformGLTexture): void;
        depthFunc(func: number): void;
        depthMask(flag: boolean): void;
        depthRange(zNear: number, zFar: number): void;
        detachShader(program: IPlatformGLProgram, shader: IPlatformGLShader): void;
        disable(cap: number): void;
        disableVertexAttribArray(index: number): void;
        drawArrays(mode: number, first: number, count: number): void;
        drawElements(mode: number, count: number, type: number, offset: number): void;
        enable(cap: number): void;
        enableVertexAttribArray(index: number): void;
        finish(): void;
        flush(): void;
        framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: IPlatformGLRenderbuffer): void;
        framebufferTexture2D(target: number, attachment: number, textarget: number, texture: IPlatformGLTexture, level: number): void;
        frontFace(mode: number): void;
        generateMipmap(target: number): void;
        getActiveAttrib(program: IPlatformGLProgram, index: number): IPlatformGLActiveInfo;
        getActiveUniform(program: IPlatformGLProgram, index: number): IPlatformGLActiveInfo;
        getAttachedShaders(program: IPlatformGLProgram): IPlatformGLShader[];
        getAttribLocation(program: IPlatformGLProgram, name: string): number;
        getBufferParameter(target: number, pname: number): any;
        getParameter(pname: number): any;
        getError(): number;
        getFramebufferAttachmentParameter(target: number, attachment: number, pname: number): any;
        getProgramParameter(program: IPlatformGLProgram, pname: number): any;
        getProgramInfoLog(program: IPlatformGLProgram): string;
        getRenderbufferParameter(target: number, pname: number): any;
        getShaderParameter(shader: IPlatformGLShader, pname: number): any;
        getShaderPrecisionFormat(shadertype: number, precisiontype: number): IPlatformGLShaderPrecisionFormat;
        getShaderInfoLog(shader: IPlatformGLShader): string;
        getShaderSource(shader: IPlatformGLShader): string;
        getTexParameter(target: number, pname: number): any;
        getUniform(program: IPlatformGLProgram, location: IPlatformGLUniformLocation): any;
        getUniformLocation(program: IPlatformGLProgram, name: string): IPlatformGLUniformLocation;
        getVertexAttrib(index: number, pname: number): any;
        getVertexAttribOffset(index: number, pname: number): number;
        hint(target: number, mode: number): void;
        isBuffer(buffer: IPlatformGLBuffer): boolean;
        isEnabled(cap: number): boolean;
        isFramebuffer(framebuffer: IPlatformGLFramebuffer): boolean;
        isProgram(program: IPlatformGLProgram): boolean;
        isRenderbuffer(renderbuffer: IPlatformGLRenderbuffer): boolean;
        isShader(shader: IPlatformGLShader): boolean;
        isTexture(texture: IPlatformGLTexture): boolean;
        lineWidth(width: number): void;
        linkProgram(program: IPlatformGLProgram): void;
        pixelStorei(pname: number, param: number): void;
        polygonOffset(factor: number, units: number): void;
        readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;
        renderbufferStorage(target: number, internalformat: number, width: number, height: number): void;
        sampleCoverage(value: number, invert: boolean): void;
        scissor(x: number, y: number, width: number, height: number): void;
        shaderSource(shader: IPlatformGLShader, source: string): void;
        stencilFunc(func: number, ref: number, mask: number): void;
        stencilFuncSeparate(face: number, func: number, ref: number, mask: number): void;
        stencilMask(mask: number): void;
        stencilMaskSeparate(face: number, mask: number): void;
        stencilOp(fail: number, zfail: number, zpass: number): void;
        stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;
        texImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels: ArrayBufferView): void;
        texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: ImageData): void;
        texImage2D(target: number, level: number, internalformat: number, format: number, type: number, image: HTMLImageElement): void;
        texImage2D(target: number, level: number, internalformat: number, format: number, type: number, canvas: HTMLCanvasElement): void;
        texImage2D(target: number, level: number, internalformat: number, format: number, type: number, video: HTMLVideoElement): void;
        texParameterf(target: number, pname: number, param: number): void;
        texParameteri(target: number, pname: number, param: number): void;
        texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;
        texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, pixels: ImageData): void;
        texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, image: HTMLImageElement): void;
        texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, canvas: HTMLCanvasElement): void;
        texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, video: HTMLVideoElement): void;
        uniform1f(location: IPlatformGLUniformLocation, x: number): void;
        uniform1fv(location: IPlatformGLUniformLocation, v: Float32Array): void;
        uniform1fv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform1i(location: IPlatformGLUniformLocation, x: number): void;
        uniform1iv(location: IPlatformGLUniformLocation, v: Int32Array): void;
        uniform1iv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform2f(location: IPlatformGLUniformLocation, x: number, y: number): void;
        uniform2fv(location: IPlatformGLUniformLocation, v: Float32Array): void;
        uniform2fv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform2i(location: IPlatformGLUniformLocation, x: number, y: number): void;
        uniform2iv(location: IPlatformGLUniformLocation, v: Int32Array): void;
        uniform2iv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform3f(location: IPlatformGLUniformLocation, x: number, y: number, z: number): void;
        uniform3fv(location: IPlatformGLUniformLocation, v: Float32Array): void;
        uniform3fv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform3i(location: IPlatformGLUniformLocation, x: number, y: number, z: number): void;
        uniform3iv(location: IPlatformGLUniformLocation, v: Int32Array): void;
        uniform3iv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform4f(location: IPlatformGLUniformLocation, x: number, y: number, z: number, w: number): void;
        uniform4fv(location: IPlatformGLUniformLocation, v: Float32Array): void;
        uniform4fv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniform4i(location: IPlatformGLUniformLocation, x: number, y: number, z: number, w: number): void;
        uniform4iv(location: IPlatformGLUniformLocation, v: Int32Array): void;
        uniform4iv(location: IPlatformGLUniformLocation, v: number[]): void;
        uniformMatrix2fv(location: IPlatformGLUniformLocation, transpose: boolean, value: Float32Array): void;
        uniformMatrix2fv(location: IPlatformGLUniformLocation, transpose: boolean, value: number[]): void;
        uniformMatrix3fv(location: IPlatformGLUniformLocation, transpose: boolean, value: Float32Array): void;
        uniformMatrix3fv(location: IPlatformGLUniformLocation, transpose: boolean, value: number[]): void;
        uniformMatrix4fv(location: IPlatformGLUniformLocation, transpose: boolean, value: Float32Array): void;
        uniformMatrix4fv(location: IPlatformGLUniformLocation, transpose: boolean, value: number[]): void;
        useProgram(program: IPlatformGLProgram): void;
        validateProgram(program: IPlatformGLProgram): void;
        vertexAttrib1f(indx: number, x: number): void;
        vertexAttrib1fv(indx: number, values: Float32Array): void;
        vertexAttrib1fv(indx: number, value: number[]): void;
        vertexAttrib2f(indx: number, x: number, y: number): void;
        vertexAttrib2fv(indx: number, values: Float32Array): void;
        vertexAttrib2fv(indx: number, value: number[]): void;
        vertexAttrib3f(indx: number, x: number, y: number, z: number): void;
        vertexAttrib3fv(indx: number, values: Float32Array): void;
        vertexAttrib3fv(indx: number, value: number[]): void;
        vertexAttrib4f(indx: number, x: number, y: number, z: number, w: number): void;
        vertexAttrib4fv(indx: number, values: Float32Array): void;
        vertexAttrib4fv(indx: number, value: number[]): void;
        vertexAttribPointer(indx: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
        viewport(x: number, y: number, width: number, height: number): void;
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
        public loader: Resource.Loader;
        public files: HG.Core.Hash<any, string>;
        constructor(loader: Resource.Loader);
        public cache(path: string, data?: any): CacheResults;
    }
}
declare module HG.Resource {
    class Loader extends HG.Core.EventDispatcher {
        public baseDirectory: string;
        public cache: Resource.Cache;
        constructor(baseDirectory: string);
        public path(path: string): string;
        private load(relPath, namespace, silent, loaderArgs);
        public model(path: string, silent?: boolean, ...args: any[]): HG.Core.EventDispatcher;
        public sound(path: string, silent?: boolean, ...args: any[]): HG.Core.EventDispatcher;
        public video(path: string, silent?: boolean, ...args: any[]): HG.Core.EventDispatcher;
        public texture(path: string, silent?: boolean, ...args: any[]): HG.Core.EventDispatcher;
        public queueTexture(paths: string[], done: (textures: HG.Core.Hash<string, THREE.Texture>) => void): void;
        public queueJSON<T>(paths: string[], done: (jsons: HG.Core.Hash<string, T>) => void): void;
        public shader(path: string): HG.Core.Shader;
        public json<T>(path: string, data?: T): T;
        public directory(directory: string, extension?: string): string[];
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
declare module HG.Resource.Sound {
    class WAV extends HG.Core.EventDispatcher implements Resource.IFiletype {
        public events: string[];
        public load(path: string): void;
    }
}
declare module HG.Resource.Texture {
    class JPG extends HG.Core.EventDispatcher implements Resource.IFiletype {
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
        public loader: HG.Resource.Loader;
        public defaultPosition: number[];
        public defaultRotation: number[];
        public defaultOffset: number[];
        public defaultScale: number[];
        constructor(scene: Core.Scene, loader: HG.Resource.Loader);
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
        public loader: HG.Resource.Loader;
        public done: number;
        constructor(loader: HG.Resource.Loader);
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
    class Effect extends HG.Core.EventDispatcher {
        public name: string;
        public gainNode: GainNode;
        public destination: Sound.Channel;
        public source: AudioBufferSourceNode;
        public buffer: AudioBuffer;
        public rootContext: AudioContext;
        constructor(ch: Sound.Channel);
        public create(data: AudioBuffer): void;
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
