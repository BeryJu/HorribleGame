/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:00:43
*/
var HG;
(function (HG) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            //holds all event callbacks like
            //{ name: [cb1, cb2 ] }
            this.events = {};
            this.globalEvents = [];
            //holds events available to subscribe to
            //if subscribed to an event not in there,
            //there will be a warning
            this.eventsAvailable = [];
        }
        EventDispatcher.prototype.resolve = function (raw) {
            var result;
            if (typeof raw === "number") {
                result = raw.toString();
            } else {
                result = raw.toString().toLowerCase();
            }
            return result;
        };

        EventDispatcher.prototype.onAll = function (callback) {
            this.globalEvents.push(callback);
        };

        EventDispatcher.prototype.on = function (name, callback) {
            var _this = this;
            if (Array.isArray(name) === true) {
                name.forEach(function (n) {
                    _this.on(n, callback);
                });
            } else {
                var type = this['constructor']['name'];
                var resolved = this.resolve(name);

                if (this.eventsAvailable.indexOf(resolved) === -1) {
                    console.warn("[" + type + "] Event '" + name + "' not available, still added though");
                } else {
                    console.log("[" + type + "] Added EventHandler for '" + name + "'");
                }

                if (!this.events[resolved]) {
                    this.events[resolved] = [];
                }

                if (!callback) {
                    if (this[resolved] && typeof (this[resolved]) === 'function') {
                        callback = this[resolved];
                    } else {
                        throw new Error("Can't add empty event Handler");
                    }
                }

                //actually add the callback
                this.events[resolved].push(callback);
                return this;
            }
        };

        EventDispatcher.prototype.inject = function (name, callback) {
            var _this = this;
            if (Array.isArray(name) === true) {
                name.forEach(function (n) {
                    _this.inject(n, callback);
                });
            } else {
                var type = this['constructor']['name'];
                var resolved = this.resolve(name);

                if (!this.events[resolved]) {
                    this.events[resolved] = [];
                }
                console.log("[" + type + "] Injected EventHandler for '" + name + "'");

                //actually add the callback
                this.events[resolved].splice(0, 0, callback);
                return this;
            }
        };

        EventDispatcher.prototype.clear = function (name) {
            if (typeof name !== "number")
                name = name.toString().toLowerCase();
            if (!this.events[name])
                return;
            if (this.events[name].length === 0)
                return;
            this.events[name] = [];
            return this;
        };

        EventDispatcher.prototype.dispatch = function (name) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var _this = this;
            if (Array.isArray(name) === true) {
                name.forEach(function (n) {
                    return _this.dispatch(n, args);
                });
            } else {
                var resolved = this.resolve(name);
                if (!(resolved in this.eventsAvailable))
                    this.eventsAvailable.push(resolved);
                if (!this.events[resolved])
                    return;
                if (this.events[resolved].length === 0)
                    return;
                var parameters = Array.prototype.splice.call(arguments, 1);
                parameters.push(resolved);
                this.events[resolved].forEach(function (event) {
                    event.apply(_this, parameters);
                });
                this.globalEvents.forEach(function (event) {
                    event.apply(_this, parameters);
                });
                return this;
            }
        };
        return EventDispatcher;
    })();
    HG.EventDispatcher = EventDispatcher;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:53:25
*/
///<reference path="EventDispatcher.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HG;
(function (HG) {
    var BaseGame = (function (_super) {
        __extends(BaseGame, _super);
        function BaseGame(container, settings) {
            if (typeof container === "undefined") { container = document.body; }
            if (typeof settings === "undefined") { settings = ""; }
            _super.call(this);
            this.isRunning = false;
            this.controls = new HG.InputHandler();
            this.fpsCounter = new HG.Utils.FPSCounter();
            this.shaders = [];
            this.eventsAvailable = [
                "load",
                "connected",
                "start",
                "keyup",
                "keydown",
                "resize",
                "render",
                "mouseDown",
                "mouseUp",
                "mouseMove"
            ];
            new HG.Utils.Bootstrapper().bootstrap();
            var moduleLoader = new HG.Utils.ModuleLoader();
            HG.Settings = HG.loadSettings(settings, new HG.SettingsStructure());

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

            this.camera = new HG.Entities.CameraEntity(HG.Settings.Graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.Settings.Graphics.viewDistance);
            this.renderer = new THREE.WebGLRenderer({
                antialias: HG.Settings.Graphics.antialiasing,
                preserveDrawingBuffer: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(this.renderer.domElement);
        }
        BaseGame.prototype.screenshot = function (path, imageType) {
            if (typeof imageType === "undefined") { imageType = "image/png"; }
            var data = this.renderer.domElement.toDataURL(imageType);
            console.debug(data);

            //data:image/png;base64
            var raw = new Buffer(data.replace("data:" + imageType + ";base64,", ""), 'base64');
            global.fs.writeFile(path, raw);
        };

        BaseGame.prototype.scene = function (s) {
            this.pluginHost.dispatch('sceneChange', s);
            this.currentScene = s;
        };

        BaseGame.prototype.title = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            document.title = args.join("");
        };

        BaseGame.prototype.loadShader = function (path) {
            var s = new HG.Shader(path);
            this.shaders.push(s);
            return s;
        };

        BaseGame.prototype.load = function () {
            console.log('[BaseGame] Loading assets');
            this.dispatch('load');
            console.log('[BaseGame] Loaded assets');
        };

        BaseGame.prototype.connect = function (serverHost) {
            this.socketClient = global['socket.io-client'].connect(serverHost);
            this.socketClient.on('news', function (data) {
                console.log(data);
            });
            this.dispatch("connected", serverHost);
        };

        BaseGame.prototype.start = function (serverHost) {
            this.connect(serverHost);
            this.dispatch('start');
            this.isRunning = true;
        };

        BaseGame.prototype.onKeyUp = function (e) {
            this.controls.onKeyUp(e);
            this.currentScene.controls.onKeyUp(e);
            this.dispatch('keyUp', e);
        };

        BaseGame.prototype.onKeyDown = function (e) {
            this.controls.onKeyDown(e);
            this.currentScene.controls.onKeyDown(e);
            this.dispatch('keyDown', e);
        };

        BaseGame.prototype.onMouseDown = function (e) {
            this.controls.onMouseDown(e);
            this.currentScene.controls.onMouseDown(e);
            this.dispatch('mouseDown', e);
        };

        BaseGame.prototype.onMouseUp = function (e) {
            this.controls.onMouseUp(e);
            this.currentScene.controls.onMouseUp(e);
            this.dispatch('mouseUp', e);
        };

        BaseGame.prototype.onMouseMove = function (e) {
            this.controls.onMouseMove(e);
            this.currentScene.controls.onMouseMove(e);
            this.dispatch('mouseMove', e);
        };

        BaseGame.prototype.onResize = function () {
            this.dispatch('resize');
            this.camera.resize(window.innerWidth / window.innerHeight);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        BaseGame.prototype.render = function () {
            var delta = this.fpsCounter.frameTime / 10;
            this.dispatch('render', delta);
            this.currentScene.forNamed(function (e) {
                return e.frame(delta);
            });
            this.currentScene.controls.frame(delta);
            this.camera.frame(delta);
            this.controls.frame(delta);
            this.fpsCounter.frame(delta);
            this.currentScene.getInternal().simulate();
            this.renderer.render(this.currentScene.getInternal(), this.camera.getInternal());
        };
        return BaseGame;
    })(HG.EventDispatcher);
    HG.BaseGame = BaseGame;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:29
*/
///<reference path="EventDispatcher" />
var HG;
(function (HG) {
    var BaseServer = (function (_super) {
        __extends(BaseServer, _super);
        function BaseServer(port) {
            _super.call(this);
            this.socketServer = global['socket.io'].listen(port);
            this.socketServer.set("log level", 1);
            this.socketServer.sockets.on('connection', function (socket) {
                socket.on('my other event', function (data) {
                    console.log(data);
                });
            });
        }
        return BaseServer;
    })(HG.EventDispatcher);
    HG.BaseServer = BaseServer;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-18 21:20:56
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:24:54
*/
var HG;
(function (HG) {
    HG._warn;
    HG._error;
    HG._log;

    function horrible() {
        HG._warn = console.warn;
        HG._error = console.error;
        HG._log = console.log;

        console.log = function () {
            var msg = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                msg[_i] = arguments[_i + 0];
            }
            if (!HG["SILENT"] && HG["SILENT"] !== true) {
                HG._log.apply(console, msg);
            }
        };

        console.warn = function () {
            var msg = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                msg[_i] = arguments[_i + 0];
            }
            if (!HG["SILENT"] && HG["SILENT"] !== true) {
                HG._warn.apply(console, msg);
            }
        };

        console.error = function () {
            var msg = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                msg[_i] = arguments[_i + 0];
            }
            if (!HG["SILENT"] && HG["SILENT"] !== true) {
                HG._error.apply(console, msg);
            }
        };
    }
    HG.horrible = horrible;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-11 17:37:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/
/// <reference path="IPlugin.ts" />
var HG;
(function (HG) {
    (function (Plugins) {
        var PluginHost = (function (_super) {
            __extends(PluginHost, _super);
            function PluginHost(instance) {
                _super.call(this);
                this.eventsAvailable = ['load', 'sceneChange'];
                this.plugins = [];
                this.paths = [];
                this.game = instance;
            }
            PluginHost.prototype.doReload = function () {
                this.paths.forEach(function (path) {
                    var resolved = global.require.resolve("./" + path);
                    delete global.require.cache[resolved];
                });
            };

            PluginHost.prototype.hook = function (instance, event, callback) {
                try  {
                    var instance = instance;
                    instance.inject(event, callback);
                } catch (e) {
                    console.log("[PluginHost] Tried to inject into event " + event + " from " + instance['constructor']['name']);
                }
            };

            PluginHost.prototype.load = function (path, env) {
                var _this = this;
                path.forEach(function (file) {
                    env = {
                        HG: HG,
                        THREE: THREE,
                        game: _this.game,
                        window: window,
                        document: document
                    } || env;
                    try  {
                        var plugin = require("./" + file);
                        var instance = new plugin(_this, env);
                        console.log("[PluginHost] Loaded " + instance.name);
                        _this.plugins.push(instance);
                        _this.paths.push(file);
                    } catch (e) {
                        console.log("[PluginHost] Failed to load Plugin " + file + " because " + e);
                    }
                });
            };

            PluginHost.prototype.frame = function (delta) {
                this.plugins.forEach(function (plugin) {
                    plugin.frame(delta);
                });
            };
            return PluginHost;
        })(HG.EventDispatcher);
        Plugins.PluginHost = PluginHost;
    })(HG.Plugins || (HG.Plugins = {}));
    var Plugins = HG.Plugins;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-11 17:30:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:31
*/
/// <reference path="PluginHost.ts" />
var HG;
(function (HG) {
    (function (Plugins) {
        var IPlugin = (function () {
            function IPlugin(host, env) {
                this.name = "";
            }
            IPlugin.prototype.frame = function (delta) {
            };
            return IPlugin;
        })();
        Plugins.IPlugin = IPlugin;
    })(HG.Plugins || (HG.Plugins = {}));
    var Plugins = HG.Plugins;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:31
*/
var HG;
(function (HG) {
    var InputHandler = (function (_super) {
        __extends(InputHandler, _super);
        function InputHandler() {
            _super.call(this);
            this.keyState = [];
            this.mouseState = [];
            this.eventsAvailable = ['mouseX', 'mouseY', 'mousemove'];
            this.bind = this.on;
            this.lastMouse = new THREE.Vector2();
            for (var k in HG.Utils.KeyMap) {
                this.eventsAvailable.push(HG.Utils.KeyMap[k]);
            }
        }
        Object.defineProperty(InputHandler.prototype, "mousePosition", {
            get: function () {
                return this.lastMouse;
            },
            enumerable: true,
            configurable: true
        });

        InputHandler.prototype.onMouseMove = function (e) {
            var x = e.x || e.clientX;
            var y = e.y || e.clientY;
            if (x !== this.lastMouse.x) {
                var diffX = this.lastMouse.x - x;
                this.lastMouse.x = x;
                this.dispatch('mouseX', diffX, x);
            }
            if (y !== this.lastMouse.y) {
                var diffY = this.lastMouse.y - y;
                this.lastMouse.y = y;
                this.dispatch('mouseY', diffY, y);
            }
            this.dispatch('mouseMove', x, y);
        };

        InputHandler.prototype.onMouseDown = function (e) {
            this.mouseState[e.button] = 1;
        };

        InputHandler.prototype.onMouseUp = function (e) {
            this.mouseState[e.button] = 0;
        };

        InputHandler.prototype.onKeyDown = function (e) {
            this.keyState[e.keyCode] = 1;
        };

        InputHandler.prototype.onKeyUp = function (e) {
            this.keyState[e.keyCode] = 0;
        };

        InputHandler.prototype.frame = function (delta) {
            var _this = this;
            this.keyState.forEach(function (s, i) {
                if (s === 1)
                    _this.dispatch("keyboard" + i, delta);
            });
            this.mouseState.forEach(function (s, i) {
                if (s === 1)
                    _this.dispatch("mouse" + i, delta);
            });
        };
        return InputHandler;
    })(HG.EventDispatcher);
    HG.InputHandler = InputHandler;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/
var HG;
(function (HG) {
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer(params) {
            _super.call(this, params);
        }
        return Renderer;
    })(THREE.WebGLRenderer);
    HG.Renderer = Renderer;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/
var HG;
(function (HG) {
    var ServerConnection = (function (_super) {
        __extends(ServerConnection, _super);
        function ServerConnection(host) {
            _super.call(this);
            var io = require('socket.io-client');
            this.socket = io.connect(host);
            this.socket.emit("join", {});
        }
        return ServerConnection;
    })(HG.EventDispatcher);
    HG.ServerConnection = ServerConnection;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/
var HG;
(function (HG) {
    var Shader = (function (_super) {
        __extends(Shader, _super);
        function Shader(path) {
            _super.call(this);
            if (path) {
                var shader = require('./' + path);
                this.load(shader);
            }
        }
        Shader.prototype.load = function (raw) {
            this.vertexShader = raw['vertex'];
            this.fragmentShader = raw['fragment'];
            this.dispatch('loaded');
        };
        return Shader;
    })(HG.EventDispatcher);
    HG.Shader = Shader;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:37
*/
/// <reference path="../EventDispatcher.ts" />
var HG;
(function (HG) {
    var BaseAbility = (function (_super) {
        __extends(BaseAbility, _super);
        function BaseAbility() {
            _super.apply(this, arguments);
        }
        BaseAbility.prototype.setHost = function (entity) {
            this.hostEntity = entity;
        };

        BaseAbility.prototype.checkCompatibility = function (entity) {
            return true;
        };

        BaseAbility.prototype.frame = function (delta) {
        };
        return BaseAbility;
    })(HG.EventDispatcher);
    HG.BaseAbility = BaseAbility;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:37
*/
/// <reference path="BaseAbility.ts" />
var HG;
(function (HG) {
    (function (Abilities) {
        var AnimationAbility = (function (_super) {
            __extends(AnimationAbility, _super);
            function AnimationAbility() {
                _super.apply(this, arguments);
                this.animOffset = 0;
                this.running = false;
                this.duration = 1000;
                this.keyframes = 20;
                this.interpolation = this.duration / this.keyframes;
                this.lastKeyframe = 0;
                this.currentKeyframe = 0;
                this.eventsAvailable = ["loaded"];
            }
            AnimationAbility.prototype.setHost = function (entity) {
                var _this = this;
                this.hostEntity = entity;
                entity.on('loaded', function (g, m) {
                    g = g;
                    m = m;
                    _this.load(g, m.materials);
                });
            };

            AnimationAbility.prototype.checkCompatibility = function (entity) {
                return (entity instanceof HG.Entities.MeshEntity);
            };

            AnimationAbility.prototype.fromJS = function (path) {
                var _this = this;
                global.fs.readFile(path, function (err, data) {
                    var loader = new THREE.JSONLoader();
                    var result = loader.parse(JSON.parse(data));
                    _this.load(result.geometry, result.materials);
                });
            };

            AnimationAbility.prototype.load = function (geometry, materials) {
                materials.forEach(function (material) {
                    material.morphTargets = true;
                });
                var material = new THREE.MeshFaceMaterial(materials);
                var oldPosition = this.hostEntity.object.position;
                var oldRotation = this.hostEntity.object.rotation;
                this.hostEntity.object = new THREE.Mesh(geometry, material);
                this.hostEntity.object.position = oldPosition;
                this.hostEntity.object.rotation = oldRotation;
                this.dispatch('loaded');
            };

            AnimationAbility.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
                if (this.running === true) {
                    var time = new Date().getTime() % this.duration;
                    var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
                    if (keyframe != this.currentKeyframe) {
                        this.hostEntity.object['morphTargetInfluences'][this.lastKeyframe] = 0;
                        this.hostEntity.object['morphTargetInfluences'][this.currentKeyframe] = 1;
                        this.hostEntity.object['morphTargetInfluences'][keyframe] = 0;
                        this.lastKeyframe = this.currentKeyframe;
                        this.currentKeyframe = keyframe;
                    }
                    this.hostEntity.object['morphTargetInfluences'][keyframe] = (time % this.interpolation) / this.interpolation;
                    this.hostEntity.object['morphTargetInfluences'][this.lastKeyframe] = 1 - this.hostEntity.object['morphTargetInfluences'][keyframe];
                    this.running = false;
                }
            };
            return AnimationAbility;
        })(HG.BaseAbility);
        Abilities.AnimationAbility = AnimationAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:37
*/
/// <reference path="BaseAbility.ts" />
var HG;
(function (HG) {
    (function (Abilities) {
        var MovingAbility = (function (_super) {
            __extends(MovingAbility, _super);
            function MovingAbility() {
                _super.apply(this, arguments);
                this.jumpState = 0;
                //0: normal
                //1: rising
                //2: max
                //3: falling
                this.oldY = 0;
                this.maxY = 200;
            }
            MovingAbility.prototype.moveLeft = function (step) {
                this.hostEntity.object.translateX(step);
            };

            MovingAbility.prototype.moveRight = function (step) {
                this.hostEntity.object.translateX(-step);
            };

            MovingAbility.prototype.lower = function (step) {
                this.hostEntity.object.position.y -= step;
            };

            MovingAbility.prototype.turnLeft = function (step) {
                this.hostEntity.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), step.toRadian());
            };

            MovingAbility.prototype.turnRight = function (step) {
                this.hostEntity.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -step.toRadian());
            };

            MovingAbility.prototype.moveForward = function (step) {
                this.hostEntity.object.translateZ(step);
            };

            MovingAbility.prototype.moveBackward = function (step) {
                this.hostEntity.object.translateZ(-step);
            };

            MovingAbility.prototype.jump = function () {
                this.oldY = this.hostEntity.object.position.y;
                this.jumpState = 1;
            };

            MovingAbility.prototype.frame = function (delta) {
                if (this.jumpState >= 1) {
                    if (this.jumpState === 3) {
                        this.oldY = this.hostEntity.object.position.y;
                        this.jumpState = 0;
                    }
                    if (this.hostEntity.object.position.y < (this.maxY + this.oldY) && this.jumpState === 1) {
                        this.hostEntity.object.position.y += 3 * delta;
                    }
                    if (this.hostEntity.object.position.y >= (this.maxY + this.oldY) && this.jumpState >= 1) {
                        this.jumpState = 2;
                    }
                    if (this.hostEntity.object.position.y <= this.oldY && this.jumpState >= 2) {
                        this.hostEntity.object.position.y = this.oldY;
                        this.jumpState = 3;
                    } else if (this.jumpState >= 2) {
                        this.hostEntity.object.position.y -= 3 * delta;
                    }
                }
            };
            return MovingAbility;
        })(HG.BaseAbility);
        Abilities.MovingAbility = MovingAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:29
*/
/// <reference path="../EventDispatcher.ts" />
/// <reference path="../abilities/BaseAbility.ts" />
var HG;
(function (HG) {
    var BaseEntity = (function (_super) {
        __extends(BaseEntity, _super);
        function BaseEntity(object) {
            _super.call(this);
            this.abilities = [];
            this.positionOffset = new THREE.Vector3();
            if (object) {
                this.object = object;
            } else {
                this.object = new THREE.Mesh();
            }
        }
        BaseEntity.prototype.ability = function (a) {
            var compatible = a.checkCompatibility(this);
            if (compatible === true) {
                a.setHost(this);
                this.abilities.push(a);
            }
            return compatible;
        };

        BaseEntity.prototype.forAbilities = function (callback) {
            this.abilities.forEach(callback);
        };

        BaseEntity.prototype.offset = function (x, y, z) {
            this.positionOffset.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.scale = function (x, y, z) {
            this.object.scale.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.position = function (x, y, z) {
            x = x + this.positionOffset.x;
            y = y + this.positionOffset.y;
            z = z + this.positionOffset.z;
            this.object.position.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.rotate = function (x, y, z) {
            this.object.rotation.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.getInternal = function () {
            return this.object;
        };

        BaseEntity.prototype.frame = function (delta) {
            if (this.abilities.length > 0) {
                this.abilities.forEach(function (ability) {
                    ability.frame(delta);
                });
            }
        };
        return BaseEntity;
    })(HG.EventDispatcher);
    HG.BaseEntity = BaseEntity;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:29
*/
/// <reference path="BaseEntity.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var CameraEntity = (function (_super) {
            __extends(CameraEntity, _super);
            function CameraEntity(fov, aspect, zNear, zFar) {
                if (typeof fov === "undefined") { fov = 90; }
                if (typeof aspect === "undefined") { aspect = 1.77; }
                if (typeof zNear === "undefined") { zNear = 0.1; }
                if (typeof zFar === "undefined") { zFar = 10000; }
                _super.call(this);
                this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
            }
            CameraEntity.prototype.setViewDistance = function (distance) {
                this.object.far = distance;
                this.object.updateProjectionMatrix();
            };

            CameraEntity.prototype.resize = function (ratio) {
                this.object.aspect = ratio;
                this.object.updateProjectionMatrix();
            };
            return CameraEntity;
        })(HG.BaseEntity);
        Entities.CameraEntity = CameraEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:29
*/
/// <reference path="BaseEntity.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var ChasingCameraEntity = (function (_super) {
            __extends(ChasingCameraEntity, _super);
            function ChasingCameraEntity(target, fov, aspect, zNear, zFar) {
                if (typeof fov === "undefined") { fov = 90; }
                if (typeof aspect === "undefined") { aspect = 1.77; }
                if (typeof zNear === "undefined") { zNear = 0.1; }
                if (typeof zFar === "undefined") { zFar = 10000; }
                _super.call(this);
                this.lookAt = true;
                this.target = target;
                this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
            }
            ChasingCameraEntity.prototype.frame = function (delta) {
                var cameraOffset = this.positionOffset.clone().applyMatrix4(this.target.object.matrixWorld);

                this.object.position.x = cameraOffset.x;
                this.object.position.y = cameraOffset.y;
                this.object.position.z = cameraOffset.z;
                if (this.lookAt)
                    this.object.lookAt(this.target.object.position);
            };
            return ChasingCameraEntity;
        })(Entities.CameraEntity);
        Entities.ChasingCameraEntity = ChasingCameraEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:29
*/
/// <reference path="BaseEntity.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var FirstPersonCameraEntity = (function (_super) {
            __extends(FirstPersonCameraEntity, _super);
            function FirstPersonCameraEntity(fov, aspect, zNear, zFar) {
                if (typeof fov === "undefined") { fov = 90; }
                if (typeof aspect === "undefined") { aspect = 1.77; }
                if (typeof zNear === "undefined") { zNear = 0.1; }
                if (typeof zFar === "undefined") { zFar = 10000; }
                _super.call(this);
                this.lookAt = true;
                this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
            }
            FirstPersonCameraEntity.prototype.setViewDistance = function (d) {
                this.object.far = d;
                this.object.updateProjectionMatrix();
            };

            FirstPersonCameraEntity.prototype.frame = function (delta) {
                var cameraOffset = this.positionOffset.clone().applyMatrix4(this.target.object.matrixWorld);
                console.log(typeof cameraOffset);
                this.object.position.x = cameraOffset.x;
                this.object.position.y = cameraOffset.y;
                this.object.position.z = cameraOffset.z;
                if (this.lookAt)
                    this.object.lookAt(this.target.object.position);
            };
            return FirstPersonCameraEntity;
        })(Entities.CameraEntity);
        Entities.FirstPersonCameraEntity = FirstPersonCameraEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:30
*/
var HG;
(function (HG) {
    (function (Entities) {
        var HeightMapEntity = (function (_super) {
            __extends(HeightMapEntity, _super);
            function HeightMapEntity(directory, size, directions, suffix) {
                if (typeof size === "undefined") { size = 5000; }
                if (typeof directions === "undefined") { directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]; }
                if (typeof suffix === "undefined") { suffix = ".png"; }
                _super.call(this);
                var skyGeometry = new THREE.CubeGeometry(size, size, size);

                var materialArray = [];
                directions.forEach(function (d) {
                    materialArray.push(new THREE.MeshBasicMaterial({
                        map: THREE.ImageUtils.loadTexture(directory + d + suffix),
                        side: THREE.BackSide
                    }));
                });
                var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
                this.object = new THREE.Mesh(skyGeometry, skyMaterial);
            }
            return HeightMapEntity;
        })(HG.BaseEntity);
        Entities.HeightMapEntity = HeightMapEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:30
*/
/// <reference path="../abilities/BaseAbility.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var MeshEntity = (function (_super) {
            __extends(MeshEntity, _super);
            function MeshEntity(geo, mat) {
                _super.call(this);
                this.abilities = [];
                this.positionOffset = new THREE.Vector3();
                if (geo && mat)
                    this.object = new THREE.Mesh(geo, mat);
            }
            MeshEntity.prototype.from = function (data) {
                data.loader.on('loaded', function () {
                });
            };
            return MeshEntity;
        })(HG.BaseEntity);
        Entities.MeshEntity = MeshEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:30
*/
/// <reference path="BaseEntity.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var ParticleEntity = (function (_super) {
            __extends(ParticleEntity, _super);
            function ParticleEntity(map, count, size) {
                if (typeof count === "undefined") { count = 1800; }
                if (typeof size === "undefined") { size = 20; }
                _super.call(this);
                this.count = 1800;
                this.size = 20;
                this.color = 0xFFFFFF;
                this.size = size;
                this.count = count;
                this.map = map;
                this.create();
            }
            ParticleEntity.prototype.create = function () {
                var geometry = new THREE.Geometry();
                var material = new THREE.ParticleBasicMaterial({
                    color: this.color,
                    size: this.size,
                    map: THREE.ImageUtils.loadTexture(this.map),
                    blending: THREE.AdditiveBlending,
                    transparent: true
                });

                for (var p = 0; p < this.count; p++) {
                    var pX = Math.random() * 500 - 250;
                    var pY = Math.random() * 500 - 250;
                    var pZ = Math.random() * 500 - 250;
                    var particle = new THREE.Vector3(pX, pY, pZ);
                    geometry.vertices.push(particle);
                }
                var system = new THREE.ParticleSystem(geometry, material);
                system.sortParticles = true;
                this.object = system;
            };
            return ParticleEntity;
        })(HG.BaseEntity);
        Entities.ParticleEntity = ParticleEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:30
*/
/// <reference path="BaseEntity.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var SkyBoxEntity = (function (_super) {
            __extends(SkyBoxEntity, _super);
            function SkyBoxEntity(directory, size, directions, suffix) {
                if (typeof size === "undefined") { size = 5000; }
                if (typeof directions === "undefined") { directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]; }
                if (typeof suffix === "undefined") { suffix = ".png"; }
                _super.call(this);
                var skyGeometry = new THREE.CubeGeometry(size, size, size);

                var materialArray = [];
                directions.forEach(function (d) {
                    materialArray.push(new THREE.MeshBasicMaterial({
                        map: THREE.ImageUtils.loadTexture(directory + d + suffix),
                        side: THREE.BackSide
                    }));
                });
                var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
                this.object = new THREE.Mesh(skyGeometry, skyMaterial);
            }
            return SkyBoxEntity;
        })(HG.BaseEntity);
        Entities.SkyBoxEntity = SkyBoxEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:30
*/
/// <reference path="BaseEntity.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var VideoEntity = (function (_super) {
            __extends(VideoEntity, _super);
            function VideoEntity(url) {
                _super.call(this);
            }
            return VideoEntity;
        })(HG.BaseEntity);
        Entities.VideoEntity = VideoEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:36
*/
var HG;
(function (HG) {
    (function (Utils) {
        var Noise = (function () {
            function Noise() {
            }
            Noise.Generate2 = function (x, y) {
                var F2 = 0.366025403;
                var G2 = 0.211324865;

                var n0, n1, n2;

                // Skew the input space to determine which simplex cell we're in
                var s = (x + y) * F2;
                var xs = x + s;
                var ys = y + s;
                var i = Math.floor(xs);
                var j = Math.floor(ys);

                var t = (i + j) * G2;
                var X0 = i - t;
                var Y0 = j - t;
                var x0 = x - X0;
                var y0 = y - Y0;

                // For the 2D case, the simplex shape is an equilateral triangle.
                // Determine which simplex we are in.
                var i1, j1;
                if (x0 > y0) {
                    i1 = 1;
                    j1 = 0;
                } else {
                    i1 = 0;
                    j1 = 1;
                }

                // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
                // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
                // c = (3-sqrt(3))/6
                var x1 = x0 - i1 + G2;
                var y1 = y0 - j1 + G2;
                var x2 = x0 - 1.0 + 2.0 * G2;
                var y2 = y0 - 1.0 + 2.0 * G2;

                // Wrap the integer indices at 256, to avoid indexing Noise.perm[] out of bounds
                var ii = i % 256;
                var jj = j % 256;

                // Calculate the contribution from the three corners
                var t0 = 0.5 - x0 * x0 - y0 * y0;
                if (t0 < 0.0)
                    n0 = 0.0;
else {
                    t0 *= t0;
                    n0 = t0 * t0 * Noise.grad2(Noise.perm[ii + Noise.perm[jj]], x0, y0);
                }

                var t1 = 0.5 - x1 * x1 - y1 * y1;
                if (t1 < 0.0)
                    n1 = 0.0;
else {
                    t1 *= t1;
                    n1 = t1 * t1 * Noise.grad2(Noise.perm[ii + i1 + Noise.perm[jj + j1]], x1, y1);
                }

                var t2 = 0.5 - x2 * x2 - y2 * y2;
                if (t2 < 0.0)
                    n2 = 0.0;
else {
                    t2 *= t2;
                    n2 = t2 * t2 * Noise.grad2(Noise.perm[ii + 1 + Noise.perm[jj + 1]], x2, y2);
                }

                // Add contributions from each corner to get the final noise value.
                // The result is scaled to return values in the interval [-1,1].
                return 40.0 * (n0 + n1 + n2);
            };

            Noise.Generate3 = function (x, y, z) {
                // Simple skewing factors for the 3D case
                var F3 = 0.333333333;
                var G3 = 0.166666667;

                var n0, n1, n2, n3;

                // Skew the input space to determine which simplex cell we're in
                var s = (x + y + z) * F3;
                var xs = x + s;
                var ys = y + s;
                var zs = z + s;
                var i = Math.floor(xs);
                var j = Math.floor(ys);
                var k = Math.floor(zs);

                var t = (i + j + k) * G3;
                var X0 = i - t;
                var Y0 = j - t;
                var Z0 = k - t;
                var x0 = x - X0;
                var y0 = y - Y0;
                var z0 = z - Z0;

                // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
                // Determine which simplex we are in.
                var i1, j1, k1;
                var i2, j2, k2;

                if (x0 >= y0) {
                    if (y0 >= z0) {
                        i1 = 1;
                        j1 = 0;
                        k1 = 0;
                        i2 = 1;
                        j2 = 1;
                        k2 = 0;
                    } else if (x0 >= z0) {
                        i1 = 1;
                        j1 = 0;
                        k1 = 0;
                        i2 = 1;
                        j2 = 0;
                        k2 = 1;
                    } else {
                        i1 = 0;
                        j1 = 0;
                        k1 = 1;
                        i2 = 1;
                        j2 = 0;
                        k2 = 1;
                    }
                } else {
                    if (y0 < z0) {
                        i1 = 0;
                        j1 = 0;
                        k1 = 1;
                        i2 = 0;
                        j2 = 1;
                        k2 = 1;
                    } else if (x0 < z0) {
                        i1 = 0;
                        j1 = 1;
                        k1 = 0;
                        i2 = 0;
                        j2 = 1;
                        k2 = 1;
                    } else {
                        i1 = 0;
                        j1 = 1;
                        k1 = 0;
                        i2 = 1;
                        j2 = 1;
                        k2 = 0;
                    }
                }

                // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
                // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
                // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
                // c = 1/6.
                var x1 = x0 - i1 + G3;
                var y1 = y0 - j1 + G3;
                var z1 = z0 - k1 + G3;
                var x2 = x0 - i2 + 2.0 * G3;
                var y2 = y0 - j2 + 2.0 * G3;
                var z2 = z0 - k2 + 2.0 * G3;
                var x3 = x0 - 1.0 + 3.0 * G3;
                var y3 = y0 - 1.0 + 3.0 * G3;
                var z3 = z0 - 1.0 + 3.0 * G3;

                // Wrap the integer indices at 256, to avoid indexing Noise.perm[] out of bounds
                var ii = Noise.Mod(i, 256);
                var jj = Noise.Mod(j, 256);
                var kk = Noise.Mod(k, 256);

                // Calculate the contribution from the four corners
                var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
                if (t0 < 0.0)
                    n0 = 0.0;
else {
                    t0 *= t0;
                    n0 = t0 * t0 * Noise.grad3(Noise.perm[ii + Noise.perm[jj + Noise.perm[kk]]], x0, y0, z0);
                }

                var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
                if (t1 < 0.0)
                    n1 = 0.0;
else {
                    t1 *= t1;
                    n1 = t1 * t1 * Noise.grad3(Noise.perm[ii + i1 + Noise.perm[jj + j1 + Noise.perm[kk + k1]]], x1, y1, z1);
                }

                var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
                if (t2 < 0.0)
                    n2 = 0.0;
else {
                    t2 *= t2;
                    n2 = t2 * t2 * Noise.grad3(Noise.perm[ii + i2 + Noise.perm[jj + j2 + Noise.perm[kk + k2]]], x2, y2, z2);
                }

                var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
                if (t3 < 0.0)
                    n3 = 0.0;
else {
                    t3 *= t3;
                    n3 = t3 * t3 * Noise.grad3(Noise.perm[ii + 1 + Noise.perm[jj + 1 + Noise.perm[kk + 1]]], x3, y3, z3);
                }

                // Add contributions from each corner to get the final noise value.
                // The result is scaled to stay just inside [-1,1]
                return 32.0 * (n0 + n1 + n2 + n3);
            };

            Noise.Mod = function (x, m) {
                var a = x % m;
                return a < 0 ? a + m : a;
            };

            Noise.grad1 = function (hash, x) {
                var h = hash & 15;
                var grad = 1.0 + (h & 7);
                if ((h & 8) != 0)
                    grad = -grad;
                return (grad * x);
            };

            Noise.grad2 = function (hash, x, y) {
                var h = hash & 7;
                var u = h < 4 ? x : y;
                var v = h < 4 ? y : x;
                return ((h & 1) != 0 ? -u : u) + ((h & 2) != 0 ? -2.0 * v : 2.0 * v);
            };

            Noise.grad3 = function (hash, x, y, z) {
                var h = hash & 15;
                var u = h < 8 ? x : y;
                var v = h < 4 ? y : h == 12 || h == 14 ? x : z;
                return ((h & 1) != 0 ? -u : u) + ((h & 2) != 0 ? -v : v);
            };

            Noise.grad4 = function (hash, x, y, z, t) {
                var h = hash & 31;
                var u = h < 24 ? x : y;
                var v = h < 16 ? y : z;
                var w = h < 8 ? z : t;
                return ((h & 1) != 0 ? -u : u) + ((h & 2) != 0 ? -v : v) + ((h & 4) != 0 ? -w : w);
            };
            Noise.perm = [
                151,
                160,
                137,
                91,
                90,
                15,
                131,
                13,
                201,
                95,
                96,
                53,
                194,
                233,
                7,
                225,
                140,
                36,
                103,
                30,
                69,
                142,
                8,
                99,
                37,
                240,
                21,
                10,
                23,
                190,
                6,
                148,
                247,
                120,
                234,
                75,
                0,
                26,
                197,
                62,
                94,
                252,
                219,
                203,
                117,
                35,
                11,
                32,
                57,
                177,
                33,
                88,
                237,
                149,
                56,
                87,
                174,
                20,
                125,
                136,
                171,
                168,
                68,
                175,
                74,
                165,
                71,
                134,
                139,
                48,
                27,
                166,
                77,
                146,
                158,
                22931,
                83,
                111,
                229,
                122,
                60,
                211,
                133,
                230,
                220,
                105,
                92,
                41,
                55,
                46,
                245,
                40,
                244,
                102,
                143,
                54,
                65,
                25,
                63,
                161,
                1,
                216,
                80,
                73,
                209,
                76,
                132,
                187,
                208,
                89,
                18,
                169,
                200,
                196,
                135,
                130,
                116,
                188,
                159,
                86,
                164,
                100,
                109,
                198,
                173,
                186,
                3,
                64,
                52,
                217,
                226,
                250,
                124,
                123,
                5,
                202,
                38,
                147,
                118,
                126,
                255,
                82,
                85,
                212,
                207,
                206,
                59,
                227,
                47,
                16,
                58,
                17,
                182,
                189,
                28,
                42,
                223,
                183,
                170,
                213,
                119,
                248,
                152,
                2,
                44,
                154,
                163,
                70,
                221,
                153,
                101,
                155,
                167,
                43,
                172,
                9,
                129,
                22,
                39,
                253,
                19,
                98,
                108,
                110,
                79,
                113,
                224,
                232,
                178,
                185,
                112,
                104,
                218,
                246,
                97,
                228,
                251,
                34,
                242,
                193,
                238,
                210,
                144,
                12,
                191,
                179,
                162,
                241,
                81,
                51,
                145,
                235,
                249,
                14,
                239,
                107,
                49,
                192,
                214,
                31,
                181,
                199,
                106,
                157,
                184,
                84,
                204,
                176,
                115,
                121,
                50,
                45,
                127,
                4,
                150,
                254,
                138,
                236,
                205,
                93,
                222,
                114,
                67,
                29,
                24,
                72,
                243,
                141,
                128,
                195,
                78,
                66,
                215,
                61,
                156,
                180,
                151,
                160,
                137,
                91,
                90,
                15,
                131,
                13,
                201,
                95,
                96,
                53,
                194,
                233,
                7,
                225,
                140,
                36,
                103,
                30,
                69,
                142,
                8,
                99,
                37,
                240,
                21,
                10,
                23,
                190,
                6,
                148,
                247,
                120,
                234,
                75,
                0,
                26,
                197,
                62,
                94,
                252,
                219,
                203,
                117,
                35,
                11,
                32,
                57,
                177,
                33,
                88,
                237,
                149,
                56,
                87,
                174,
                20,
                125,
                136,
                171,
                168,
                68,
                175,
                74,
                165,
                71,
                134,
                139,
                48,
                27,
                166,
                77,
                146,
                158,
                231,
                83,
                111,
                229,
                122,
                60,
                211,
                133,
                230,
                220,
                105,
                92,
                41,
                55,
                46,
                245,
                40,
                244,
                102,
                143,
                54,
                65,
                25,
                63,
                161,
                1,
                216,
                80,
                73,
                209,
                76,
                132,
                187,
                208,
                89,
                18,
                169,
                200,
                196,
                135,
                130,
                116,
                188,
                159,
                86,
                164,
                100,
                109,
                198,
                173,
                186,
                3,
                64,
                52,
                217,
                226,
                250,
                124,
                123,
                5,
                202,
                38,
                147,
                118,
                126,
                255,
                82,
                85,
                212,
                207,
                206,
                59,
                227,
                47,
                16,
                58,
                17,
                182,
                189,
                28,
                42,
                223,
                183,
                170,
                213,
                119,
                248,
                152,
                2,
                44,
                154,
                163,
                70,
                221,
                153,
                101,
                155,
                167,
                43,
                172,
                9,
                129,
                22,
                39,
                253,
                19,
                98,
                108,
                110,
                79,
                113,
                224,
                232,
                178,
                185,
                112,
                104,
                218,
                246,
                97,
                228,
                251,
                34,
                242,
                193,
                238,
                210,
                144,
                12,
                191,
                179,
                162,
                241,
                81,
                51,
                145,
                235,
                249,
                14,
                239,
                107,
                49,
                192,
                214,
                31,
                181,
                199,
                106,
                157,
                184,
                84,
                204,
                176,
                115,
                121,
                50,
                45,
                127,
                4,
                150,
                254,
                138,
                236,
                205,
                93,
                222,
                114,
                67,
                29,
                24,
                72,
                243,
                141,
                128,
                195,
                78,
                66,
                215,
                61,
                156,
                180
            ];
            return Noise;
        })();
        Utils.Noise = Noise;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:07
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:31
*/
/// <reference path="../utils/Noise.ts" />
var HG;
(function (HG) {
    (function (CONSTANTS) {
        CONSTANTS.SIZE_X = 64;
        CONSTANTS.SIZE_Y = CONSTANTS.SIZE_X / 4;
        CONSTANTS.BLOCK_SIZE = 50;
    })(HG.CONSTANTS || (HG.CONSTANTS = {}));
    var CONSTANTS = HG.CONSTANTS;

    var LevelStructure = (function (_super) {
        __extends(LevelStructure, _super);
        function LevelStructure() {
            _super.apply(this, arguments);
            this.camera = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 }
            };
            this.eventsAvailable = ["loaded", "created"];
        }
        LevelStructure.prototype.fromJS = function (path) {
            var _this = this;
            global.fs.readFile(path, function (err, data) {
                var r = JSON.parse(data);
                _this.entities = r.entities;
                _this.camera = r.camera;
                _this.dispatch('loaded', { level: _this });
            });
        };

        LevelStructure.prototype.create = function () {
            this.entities = [];
            for (var i = 0; i < CONSTANTS.SIZE_X * CONSTANTS.BLOCK_SIZE; i += CONSTANTS.BLOCK_SIZE) {
                for (var j = 0; j < CONSTANTS.SIZE_Y * CONSTANTS.BLOCK_SIZE; j += CONSTANTS.BLOCK_SIZE) {
                    var noise = HG.Utils.Noise.Generate2(i, j);
                    var k = Math.floor((noise * 50) - 50);
                    var color = HG.Utils.rgbToHex(i / 10 + 50, j / 10 + 50, ((i + j) / 2) / 10 + 50);
                    var entity = new HG.LevelStructureEntity();
                    entity.position = { x: i, y: j, z: k };
                    entity.color = color;
                    this.entities.push(entity);
                }
            }
            this.camera.position = { x: 0, y: 25, z: -25 };
            this.camera.rotation = { x: 75, y: 75, z: 0 };
            this.dispatch('created', { level: this });
        };
        return LevelStructure;
    })(HG.EventDispatcher);
    HG.LevelStructure = LevelStructure;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:31
*/
/// <reference path="LevelStructure.ts" />
var HG;
(function (HG) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level(lvl) {
            _super.call(this);
            this.entities = [];
            this.camera = {
                position: new THREE.Vector3(),
                rotation: new THREE.Vector3()
            };

            // Todo redo this
            // var g = new THREE.CubeGeometry(
            // 	HG.CONSTANTS.BLOCK_SIZE,
            // 	HG.CONSTANTS.BLOCK_SIZE,
            // 	HG.CONSTANTS.BLOCK_SIZE
            // );
            // var m =  new THREE.MeshPhongMaterial({color: 0x000000});
            // lvl.entities.forEach((e) => {
            // 	m.color = new THREE.Color(e.color);
            // 	var en = new HG.Entities.MeshEntity(g, m);
            // 	en.position(e.position.x, e.position.y, e.position.z);
            // });
            this.camera.position = new THREE.Vector3(lvl.camera.position.x, lvl.camera.position.y, lvl.camera.position.z);
            this.camera.rotation = new THREE.Vector3(lvl.camera.rotation.x, lvl.camera.rotation.y, lvl.camera.rotation.z);
        }
        Level.prototype.applyCamera = function (camera) {
            camera.object.position = this.camera.position;
            camera.rotate(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
        };

        Level.prototype.applyCameraOffset = function (camera) {
            camera.offset(this.camera.position.x, this.camera.position.y, this.camera.position.z);
            camera.rotate(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
        };
        return Level;
    })(HG.EventDispatcher);
    HG.Level = Level;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:31
*/
var HG;
(function (HG) {
    var LevelStructureEntity = (function () {
        function LevelStructureEntity() {
            this.position = { x: 0, y: 0, z: 0 };
            this.color = 0x000000;
        }
        return LevelStructureEntity;
    })();
    HG.LevelStructureEntity = LevelStructureEntity;
})(HG || (HG = {}));
/// <reference path="IProvider.ts" />
/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:32
*/
var HG;
(function (HG) {
    (function (LINQ) {
        var ArrayProvider = (function () {
            function ArrayProvider() {
            }
            ArrayProvider.prototype.each = function (context, fn) {
                context.forEach(fn);
            };

            ArrayProvider.prototype.where = function (context, query) {
                var result = [];
                context.forEach(function (e) {
                    if (query(e) === true)
                        result.push(e);
                });
                return result;
            };

            ArrayProvider.prototype.order = function (context, order) {
                return context.sort(order);
            };

            ArrayProvider.prototype.select = function (context, selector) {
                var result = [];
                context.forEach(function (e) {
                    result.push(selector(e));
                });
                return result;
            };

            ArrayProvider.prototype.registerFunction = function (key, fn) {
                Array.prototype[key] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.splice(0, 0, this);
                    return fn.apply(this, args);
                };
            };

            ArrayProvider.prototype.provide = function () {
                for (var k in this) {
                    if (k !== "provide") {
                        this.registerFunction(k, this[k]);
                    }
                }
            };
            return ArrayProvider;
        })();
        LINQ.ArrayProvider = ArrayProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-07 13:15:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:32
*/
var HG;
(function (HG) {
    (function (LINQ) {
        function initialize() {
            for (var m in HG.LINQ) {
                if (m.toString() !== "initialize") {
                    var provider = new HG.LINQ[m]();
                    provider.provide();
                    console.log("[LINQ] Provided " + m);
                }
            }
        }
        LINQ.initialize = initialize;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
/// <reference path="IProvider.ts" />
/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:32
*/
var HG;
(function (HG) {
    (function (LINQ) {
        var NumberProvider = (function () {
            function NumberProvider() {
            }
            NumberProvider.prototype.toRadian = function (nmb) {
                return nmb * (Math.PI / 180);
            };

            NumberProvider.prototype.toDegrees = function (nmb) {
                return nmb * (180 / Math.PI);
            };

            NumberProvider.prototype.registerFunction = function (key, fn) {
                Number.prototype[key] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.splice(0, 0, this);
                    return fn.apply(this, args);
                };
            };

            NumberProvider.prototype.provide = function () {
                for (var k in this) {
                    if (k !== "provide") {
                        this.registerFunction(k, this[k]);
                    }
                }
            };
            return NumberProvider;
        })();
        LINQ.NumberProvider = NumberProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
/// <reference path="IProvider.ts" />
/*
* @Author: BeryJu
* @Date:   2013-11-07 13:03:40
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:33
*/
var HG;
(function (HG) {
    (function (LINQ) {
        var StringProvider = (function () {
            function StringProvider() {
            }
            StringProvider.prototype.f = function (context) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                return "";
            };

            StringProvider.prototype.replaceAll = function (context, find, replace) {
                find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                return context.replace(new RegExp(find, 'g'), replace);
            };

            StringProvider.prototype.registerFunction = function (key, fn) {
                String.prototype[key] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.splice(0, 0, this);
                    return fn.apply(this, args);
                };
            };

            StringProvider.prototype.provide = function () {
                for (var k in this) {
                    if (k !== "provide") {
                        this.registerFunction(k, this[k]);
                    }
                }
            };
            return StringProvider;
        })();
        LINQ.StringProvider = StringProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-16 14:03:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:33
*/
var HG;
(function (HG) {
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader(baseDirectory) {
            _super.call(this);
            this.baseDirectory = "";
            this.baseDirectory = baseDirectory;
        }
        Loader.prototype.model = function (path) {
            path.replaceAll("/", global.path.sep);
            var jsLoader = new HG.Loaders.Model.JS();
            jsLoader.on("loaded");
            return { loader: this, doStuff: function () {
                    return true;
                } };
        };

        Loader.prototype.directory = function (directory) {
            var _this = this;
            var path = global.path.join(this.baseDirectory, directory);
            var files = global.fs.readdirSync(path);
            var realFiles = [];
            files.forEach(function (file) {
                realFiles.push(global.path.join(_this.baseDirectory, directory, file));
            });
            return realFiles;
        };
        return Loader;
    })(HG.EventDispatcher);
    HG.Loader = Loader;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:33
*/
var HG;
(function (HG) {
    (function (Loaders) {
        (function (Model) {
            var JS = (function (_super) {
                __extends(JS, _super);
                function JS() {
                    _super.apply(this, arguments);
                }
                JS.prototype.load = function (path) {
                    var _this = this;
                    global.fs.readFile(path, function (err, data) {
                        var loader = new THREE.JSONLoader();
                        var result = loader.parse(JSON.parse(data));
                        var material = new THREE.MeshFaceMaterial(result.materials);
                        var model = {
                            geometry: result.geometry,
                            material: material
                        };
                        _this.dispatch("loaded", model);
                    });
                };
                return JS;
            })(HG.EventDispatcher);
            Model.JS = JS;
        })(Loaders.Model || (Loaders.Model = {}));
        var Model = Loaders.Model;
    })(HG.Loaders || (HG.Loaders = {}));
    var Loaders = HG.Loaders;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-16 14:04:33
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:33
*/
var HG;
(function (HG) {
    (function (Loaders) {
        (function (Model) {
            var STL = (function (_super) {
                __extends(STL, _super);
                function STL() {
                    _super.apply(this, arguments);
                }
                STL.prototype.load = function (path, material) {
                    var _this = this;
                    var loader = new THREE.STLLoader();
                    loader.addEventListener('load', function (event) {
                        var geometry = event.content;
                        var phong = new THREE.MeshPhongMaterial({
                            ambient: 0xff5533,
                            color: 0xff5533,
                            specular: 0x111111,
                            shininess: 200
                        });
                        material = material || new THREE.MeshFaceMaterial([phong]);
                        var model = {
                            geometry: geometry,
                            material: material
                        };
                        _this.dispatch("loaded", model);
                    });
                    loader.load(path);
                };
                return STL;
            })(HG.EventDispatcher);
            Model.STL = STL;
        })(Loaders.Model || (Loaders.Model = {}));
        var Model = Loaders.Model;
    })(HG.Loaders || (HG.Loaders = {}));
    var Loaders = HG.Loaders;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/
var HG;
(function (HG) {
    (function (Scenes) {
        var BaseScene = (function () {
            function BaseScene() {
                this.scene = null;
                this.controls = new HG.InputHandler();
                this.scene = new Physijs.Scene();
                this.entities = {
                    named: {},
                    unnamed: []
                };
            }
            BaseScene.prototype.add = function (BaseEntity, nameTag) {
                this.scene.add(BaseEntity.getInternal());
                if (nameTag) {
                    this.entities.named[nameTag.toLowerCase()] = BaseEntity;
                } else {
                    this.entities.unnamed.push(BaseEntity);
                }
            };

            BaseScene.prototype.getAllNamed = function (type) {
                if (typeof type === "undefined") { type = HG.BaseEntity; }
                var es = [];
                for (var k in this.entities.named) {
                    var ne = this.entities.named[k];
                    if (ne instanceof type)
                        es.push(ne);
                    ;
                }
                return es;
            };

            BaseScene.prototype.getAllUnnamed = function (type) {
                if (typeof type === "undefined") { type = HG.BaseEntity; }
                var es = [];
                this.entities.unnamed.forEach(function (e) {
                    if (e instanceof type)
                        es.push(e);
                });
                return es;
            };

            BaseScene.prototype.getAll = function (type) {
                if (typeof type === "undefined") { type = HG.BaseEntity; }
                var es = [];
                es.concat(this.getAllUnnamed(type));
                es.concat(this.getAllNamed(type));
                return es;
            };

            BaseScene.prototype.forNamed = function (callback, type) {
                if (!type)
                    type = HG.BaseEntity;
                for (var k in this.entities.named) {
                    var ne = this.entities.named[k];
                    if (ne instanceof type)
                        callback(ne, k);
                }
            };

            BaseScene.prototype.forUnamed = function (callback, type) {
                if (!type)
                    type = HG.BaseEntity;
                this.entities.unnamed.forEach(function (e) {
                    if (e instanceof type)
                        callback(e);
                });
            };

            BaseScene.prototype.forAll = function (callback, type) {
                if (typeof type === "undefined") { type = HG.BaseEntity; }
                this.forNamed(callback, type);
                this.forUnamed(callback, type);
            };

            BaseScene.prototype.getInternal = function () {
                return this.scene;
            };

            BaseScene.prototype.get = function (nameTag, type) {
                if (typeof type === "undefined") { type = HG.BaseEntity; }
                var e = [];
                for (var i = 0; i < nameTag.length; i++) {
                    var ee = this.entities.named[nameTag[i].toLowerCase()];
                    if (ee instanceof type) {
                        e.push(ee);
                    }
                }
                return e;
            };
            return BaseScene;
        })();
        Scenes.BaseScene = BaseScene;
    })(HG.Scenes || (HG.Scenes = {}));
    var Scenes = HG.Scenes;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-10 13:59:37
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:34
*/
var HG;
(function (HG) {
    (function (Sound) {
        var BufferLoader = (function () {
            function BufferLoader(context) {
                this.context = context;
            }
            BufferLoader.prototype.loadBuffer = function (url, onload) {
                var _this = this;
                // Load buffer asynchronously
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";

                request.onload = function () {
                    // Asynchronously decode the audio file data in request.response
                    _this.context.decodeAudioData(request.response, function (buffer) {
                        if (!buffer) {
                            alert('error decoding file data: ' + url);
                            return;
                        }
                        onload(buffer);
                    }, function (error) {
                        console.error('decodeAudioData error', error);
                    });
                };

                request.onerror = function () {
                    alert('BufferLoader: XHR error');
                };

                request.send();
            };

            BufferLoader.prototype.load = function (urls, cb) {
                var _this = this;
                urls.forEach(function (url) {
                    _this.loadBuffer(url, cb);
                });
            };
            return BufferLoader;
        })();
        Sound.BufferLoader = BufferLoader;
    })(HG.Sound || (HG.Sound = {}));
    var Sound = HG.Sound;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:35
*/
/// <reference path="../EventDispatcher.ts" />
var HG;
(function (HG) {
    (function (Sound) {
        var Channel = (function (_super) {
            __extends(Channel, _super);
            function Channel(name) {
                _super.call(this);
                this.eventsAvailable = ['volumeChange'];
                this.name = name;
            }
            Object.defineProperty(Channel.prototype, "gain", {
                get: function () {
                    return this.gainNode.gain.value || 0;
                },
                enumerable: true,
                configurable: true
            });

            Channel.prototype.volume = function (gain) {
                if (this.gainNode) {
                    this.gainNode.gain.value = gain;
                    this.dispatch("volumeChange", gain);
                }
            };
            return Channel;
        })(HG.EventDispatcher);
        Sound.Channel = Channel;
    })(HG.Sound || (HG.Sound = {}));
    var Sound = HG.Sound;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:35
*/
/// <reference path="../EventDispatcher.ts" />
var HG;
(function (HG) {
    (function (Sound) {
        var Effect = (function () {
            function Effect(ch) {
                this.destination = ch;
                this.destination.on('volumeChange', this.volume);
                this.rootContext = this.destination.rootContext;
                this.gainNode = this.rootContext.createGain();
                this.gainNode.connect(this.rootContext.destination);
            }
            Object.defineProperty(Effect.prototype, "gain", {
                get: function () {
                    return this.gainNode.gain.value || 0;
                },
                enumerable: true,
                configurable: true
            });

            Effect.prototype.fromFile = function (path) {
                var _this = this;
                var loader = new HG.Sound.BufferLoader(this.rootContext);
                loader.load([path], function (data) {
                    _this.load(data);
                });
            };

            Effect.prototype.load = function (buffer) {
                this.source = this.rootContext.createBufferSource();
                this.source.buffer = buffer;
                this.source.connect(this.gainNode);
            };

            Effect.prototype.play = function () {
                if (this.source)
                    this.source.start(0);
            };

            Effect.prototype.stop = function () {
                if (this.source)
                    this.source.stop(0);
            };

            Effect.prototype.volume = function (gain) {
                if (this.gainNode)
                    this.gainNode.gain.value = gain;
            };
            return Effect;
        })();
        Sound.Effect = Effect;
    })(HG.Sound || (HG.Sound = {}));
    var Sound = HG.Sound;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-09 15:07:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:35
*/
/// <reference path="../EventDispatcher.ts" />
var HG;
(function (HG) {
    (function (Sound) {
        var Mixer = (function () {
            function Mixer() {
                this.channels = {};
                this.context = new AudioContext();
            }
            Object.defineProperty(Mixer.prototype, "gain", {
                get: function () {
                    return this.gainNode.gain.value || 0;
                },
                enumerable: true,
                configurable: true
            });

            Mixer.prototype.volume = function (gain) {
                if (this.gainNode)
                    this.gainNode.gain.value = gain;
            };

            Mixer.prototype.addChannel = function (ch) {
                ch.rootContext = this.context;
                this.channels[ch.name] = ch;
            };
            return Mixer;
        })();
        Sound.Mixer = Mixer;
    })(HG.Sound || (HG.Sound = {}));
    var Sound = HG.Sound;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-07 16:30:32
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:21:48
*/
var HG;
(function (HG) {
    (function (Utils) {
        var Bootstrapper = (function (_super) {
            __extends(Bootstrapper, _super);
            function Bootstrapper() {
                var _this = this;
                _super.call(this);
                this.eventsAvailable = ['error'];
                process.on('uncaughtException', function (err) {
                    _this.dispatch('error', err.message);
                });

                this.on('error');
            }
            Bootstrapper.prototype.bootstrap = function () {
                //Linq
                HG.LINQ.initialize();

                //Physics
                Physijs.scripts = {
                    ammo: "ammo.js",
                    worker: "lib/physijs_worker.js"
                };

                if (HG.Utils.hasGL() === false)
                    this.dispatch('error', new Error("Runtime or Graphiscard doesn't support GL"));

                //Audio
                window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext'];
            };

            Bootstrapper.prototype.error = function (error) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                console.warn(error);
                console.trace();
            };
            return Bootstrapper;
        })(HG.EventDispatcher);
        Utils.Bootstrapper = Bootstrapper;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:35
*/
var HG;
(function (HG) {
    (function (Utils) {
        var FPSCounter = (function () {
            function FPSCounter() {
                this.lastFrameTime = 0;
                this.lastSecond = 0;
                this.currentFrames = 0;
                this.highestFPS = 0;
                this._frameTime = 0;
                this.fps = 0;
                this.lastFrameTime = new Date().getTime();
            }
            Object.defineProperty(FPSCounter.prototype, "FPS", {
                get: function () {
                    return this.fps;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FPSCounter.prototype, "maxFPS", {
                get: function () {
                    return this.highestFPS;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FPSCounter.prototype, "frameTime", {
                get: function () {
                    return this._frameTime;
                },
                enumerable: true,
                configurable: true
            });

            FPSCounter.prototype.frame = function (delta) {
                var Now = new Date();
                var Diff = new Date(Now.getTime() - this.lastFrameTime);

                //FrameTime
                this._frameTime = Diff.getTime();
                this.lastFrameTime = Now.getTime();

                //FPS
                var FPSDiff = new Date(Now.getTime() - this.lastSecond);
                if (FPSDiff.getSeconds() > 0) {
                    this.fps = this.currentFrames;
                    if (this.fps > this.highestFPS)
                        this.highestFPS = this.fps;
                    this.currentFrames = 0;
                    this.lastSecond = Now.getTime();
                }
                this.currentFrames++;
            };
            return FPSCounter;
        })();
        Utils.FPSCounter = FPSCounter;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:36
*/
var HG;
(function (HG) {
    (function (Utils) {
        Utils.KeyMap = {
            D: "keyboard68",
            A: "keyboard65",
            S: "keyboard83",
            W: "keyboard87",
            Q: "keyboard81",
            E: "keyboard69",
            Left: "keyboard37",
            Right: "keyboard39",
            Top: "keyboard38",
            Shift: "keyboard16",
            Bottom: "keyboard40",
            Space: "keyboard32",
            Esc: "keyboard27",
            F5: "keyboard116",
            F11: "keyboard122",
            F12: "keyboard123"
        };
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:36
*/
var HG;
(function (HG) {
    (function (Utils) {
        var Map = (function () {
            function Map() {
                this.data = {};
            }
            Map.prototype.set = function (data, x, y, z) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (!this.data[x])
                    this.data[x] = {};
                if (!this.data[x][y])
                    this.data[x][y] = {};
                var overwritten = false;
                if (this.data[x][y][z])
                    overwritten = true;
                this.data[x][y][z] = data;
                return overwritten;
            };

            Map.prototype.get = function (x, y, z, fallback) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof z === "undefined") { z = 0; }
                if (!this.data[x])
                    return fallback;
                if (!this.data[x][y])
                    return fallback;
                if (!this.data[x][y][z])
                    return fallback;
                return this.data[x][y][z];
            };

            Map.prototype.clearX = function (x) {
                if (this.data[x])
                    this.data[x] = {};
                return true;
            };

            Map.prototype.clearY = function (x, y) {
                if (!this.data[x])
                    return false;
                if (this.data[x][y])
                    this.data[x][y] = {};
            };

            Map.prototype.clearZ = function (x, y, z) {
                if (!this.data[x])
                    return false;
                if (!this.data[x][y])
                    return false;
                if (this.data[x][y][z])
                    this.data[x][y][z] = {};
            };
            return Map;
        })();
        Utils.Map = Map;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:36
*/
var HG;
(function (HG) {
    (function (Utils) {
        var ModuleLoader = (function (_super) {
            __extends(ModuleLoader, _super);
            function ModuleLoader(additional) {
                if (typeof additional === "undefined") { additional = []; }
                _super.call(this);
                this.modules = ['fs', 'path', 'http', 'socket.io', 'socket.io-client'];
                this.modules.concat(additional);
                this.modules.forEach(function (m) {
                    console.log("[ModuleLoader] Required " + m);
                    global[m] = require(m);
                });
            }
            return ModuleLoader;
        })(HG.EventDispatcher);
        Utils.ModuleLoader = ModuleLoader;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:37
*/
var HG;
(function (HG) {
    var SettingsStructure = (function () {
        function SettingsStructure() {
            this.debug = true;
        }
        return SettingsStructure;
    })();
    HG.SettingsStructure = SettingsStructure;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-11 12:15:19
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:36
*/
/// <reference path="SettingsStructure.ts" />
var HG;
(function (HG) {
    HG.Settings;

    function loadSettings(path, fallback) {
        var raw = global.fs.readFileSync(path);
        try  {
            console.log("[Settings] Loaded Settings from JSON.");
            return JSON.parse(raw);
        } catch (e) {
            console.log("[Settings] Failed to load settings, used fallback.");
            return fallback || new HG.SettingsStructure();
        }
        return new HG.SettingsStructure();
    }
    HG.loadSettings = loadSettings;

    function saveSettings(path, settings, pretty) {
        if (typeof pretty === "undefined") { pretty = false; }
        var parsed;
        if (pretty === true) {
            parsed = JSON.stringify(settings, null, "\t");
        } else {
            parsed = JSON.stringify(settings);
        }
        global.fs.writeFile(path, parsed, function () {
        });
        console.debug("[Settings] Saved settings.");
    }
    HG.saveSettings = saveSettings;
})(HG || (HG = {}));
/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 20:13:37
*/
var HG;
(function (HG) {
    (function (Utils) {
        function rgbToHex(r, g, b) {
            var componentToHex = function (c) {
                c = Math.abs(Math.floor(c));
                if (c > 255)
                    c = 255;
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            };
            return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
        }
        Utils.rgbToHex = rgbToHex;

        function profile(fn) {
            console.profile("HG Profile");
            fn();
            console.profileEnd();
        }
        Utils.profile = profile;

        function hasGL() {
            return (window.WebGLRenderingContext) ? true : false;
        }
        Utils.hasGL = hasGL;

        function resize(resolution) {
            var whwnd = require('nw.gui').Window.get();
            whwnd.width = resolution.x;
            whwnd.height = resolution.y;
        }
        Utils.resize = resize;

        function position(position) {
            var whwnd = require('nw.gui').Window.get();
            whwnd.x = position.x;
            whwnd.y = position.y;
        }
        Utils.position = position;

        function setFullScreenMode(state) {
            var whwnd = require('nw.gui').Window.get();
            if (state === true) {
                whwnd.enterFullscreen();
            } else {
                whwnd.leaveFullscreen();
            }
        }
        Utils.setFullScreenMode = setFullScreenMode;

        function reload() {
            var whwnd = require('nw.gui').Window.get();
            whwnd.reloadIgnoringCache();
        }
        Utils.reload = reload;

        function toggleFullScreenMode() {
            var whwnd = require('nw.gui').Window.get();
            whwnd.toggleFullscreen();
        }
        Utils.toggleFullScreenMode = toggleFullScreenMode;

        function openDevConsole() {
            require('nw.gui').Window.get().showDevTools();
        }
        Utils.openDevConsole = openDevConsole;

        function openDevConsoleExternal() {
            var whwnd = require('nw.gui').Window.get();
            whwnd.showDevTools('', true);
            whwnd.on("devtools-opened", function (url) {
                console.log(url);
                require("openurl").open(url.toString());
            });
        }
        Utils.openDevConsoleExternal = openDevConsoleExternal;

        function isNode() {
            return (process) ? true : false;
        }
        Utils.isNode = isNode;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
//# sourceMappingURL=hg.js.map
