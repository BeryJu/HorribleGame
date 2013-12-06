var HG;
(function (HG) {
    (function (Core) {
        var EventDispatcher = (function () {
            function EventDispatcher(events) {
                this._events = {};
                this.globalEvents = [];
                this.events = [];
                this.bind = this.on;
                this.addEventListener = this.on;
                this.emit = this.dispatch;
                this.events = events || [];
            }
            EventDispatcher.prototype.resolve = function (raw) {
                if (HG.Utils.isNumber(raw) === true) {
                    return raw.toString();
                } else {
                    return raw.toString().toLowerCase();
                }
            };

            EventDispatcher.prototype.onAll = function (eventHandler) {
                this.globalEvents.push(eventHandler);
                return this;
            };

            EventDispatcher.prototype.on = function (name, eventHandler) {
                var _this = this;
                if (Array.isArray(name) === true) {
                    name.forEach(function (n) {
                        return _this.on(n, eventHandler);
                    });
                } else {
                    var type = this["constructor"]["name"];
                    var resolved = this.resolve(name);

                    if (this.events.indexOf(resolved) === -1) {
                        HG.locale.event.eventNotAvailable.format(type, name).warn();
                    } else {
                        HG.locale.event.eventAdded.format(type, name).log();
                    }

                    if (!this._events[resolved]) {
                        this._events[resolved] = [];
                    }

                    if (!eventHandler) {
                        if (this[resolved] && HG.Utils.isFunction(this[resolved])) {
                            eventHandler = this[resolved];
                        } else {
                            HG.locale.event.isEmpty.error();
                        }
                    }

                    this._events[resolved].push(eventHandler);
                    return this;
                }
            };

            EventDispatcher.prototype.inject = function (name, eventHandler) {
                var _this = this;
                if (Array.isArray(name) === true) {
                    name.forEach(function (n) {
                        _this.inject(n, eventHandler);
                    });
                } else {
                    var type = this["constructor"]["name"];
                    var resolved = this.resolve(name);

                    if (!this._events[resolved]) {
                        this._events[resolved] = [];
                    }
                    HG.locale.event.injected.format(type, name).log();

                    this._events[resolved].splice(0, 0, eventHandler);
                    return this;
                }
            };

            EventDispatcher.prototype.clear = function (name) {
                if (typeof name !== "number")
                    name = name.toString().toLowerCase();
                if (!this._events[name])
                    return;
                if (this._events[name].length === 0)
                    return;
                this._events[name] = [];
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
                    if (!(resolved in this.events))
                        this.events.push(resolved);
                    if (!this._events[resolved])
                        return;
                    if (this._events[resolved].length === 0)
                        return;
                    var parameters = Array.prototype.splice.call(arguments, 1);
                    parameters.push(resolved);
                    this._events[resolved].forEach(function (event) {
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
        Core.EventDispatcher = EventDispatcher;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Modules) {
        Modules.fs = require("fs");
        Modules.path = require("path");
        Modules.http = require("http");
        Modules.ui;
        Modules.net = require("net");
    })(HG.Modules || (HG.Modules = {}));
    var Modules = HG.Modules;
})(HG || (HG = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HG;
(function (HG) {
    (function (Core) {
        var PluginHost = (function (_super) {
            __extends(PluginHost, _super);
            function PluginHost(instance) {
                _super.call(this);
                this.events = ["load", "sceneChange"];
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
                        HG.locale.pluginHost.success.f(instance.name).log();
                        _this.plugins.push(instance);
                        _this.paths.push(file);
                    } catch (e) {
                        HG.locale.pluginHost.failure.f(file, e).log();
                    }
                });
            };
            return PluginHost;
        })(HG.Core.EventDispatcher);
        Core.PluginHost = PluginHost;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Core) {
        var IPlugin = (function () {
            function IPlugin(host, env) {
                this.name = "";
                return;
            }
            IPlugin.prototype.frame = function (delta) {
                return;
            };
            return IPlugin;
        })();
        Core.IPlugin = IPlugin;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Utils) {
        var ISettings = (function () {
            function ISettings() {
            }
            return ISettings;
        })();
        Utils.ISettings = ISettings;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
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
                this._fps = 0;
                this.lastFrameTime = new Date().getTime();
            }
            Object.defineProperty(FPSCounter.prototype, "FPS", {
                get: function () {
                    return this._fps;
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
                var now = new Date();
                var diff = new Date(now.getTime() - this.lastFrameTime);

                this._frameTime = diff.getTime();
                this.lastFrameTime = now.getTime();

                var fpsDiff = new Date(now.getTime() - this.lastSecond);
                if (fpsDiff.getSeconds() > 0) {
                    this._fps = this.currentFrames;
                    if (this._fps > this.highestFPS)
                        this.highestFPS = this._fps;
                    this.currentFrames = 0;
                    this.lastSecond = now.getTime();
                }
                this.currentFrames++;
            };
            return FPSCounter;
        })();
        Utils.FPSCounter = FPSCounter;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Utils) {
        Utils.KEY_MAP = {
            D: 68,
            A: 65,
            S: 83,
            W: 87,
            Q: 81,
            E: 69,
            Left: 37,
            Right: 39,
            Top: 38,
            Shift: 16,
            Bottom: 40,
            Space: 32,
            Esc: 27,
            F5: 116,
            F11: 122,
            F12: 123
        };
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
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
                if (!this.data[x]) {
                    return fallback;
                } else {
                    if (!this.data[x][y]) {
                        return fallback;
                    } else {
                        if (!this.data[x][y][z]) {
                            return fallback;
                        } else {
                            return this.data[x][y][z];
                        }
                    }
                }
            };
            return Map;
        })();
        Utils.Map = Map;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Utils) {
        var Noise = (function () {
            function Noise() {
            }
            Noise.generate2 = function (x, y) {
                var F2 = 0.366025403;
                var G2 = 0.211324865;

                var n0, n1, n2;

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

                var i1, j1;
                if (x0 > y0) {
                    i1 = 1;
                    j1 = 0;
                } else {
                    i1 = 0;
                    j1 = 1;
                }

                var x1 = x0 - i1 + G2;
                var y1 = y0 - j1 + G2;
                var x2 = x0 - 1.0 + 2.0 * G2;
                var y2 = y0 - 1.0 + 2.0 * G2;

                var ii = i % 256;
                var jj = j % 256;

                var t0 = 0.5 - x0 * x0 - y0 * y0;
                if (t0 < 0.0) {
                    n0 = 0.0;
                } else {
                    t0 *= t0;
                    n0 = t0 * t0 * Noise.grad2(Noise.perm[ii + Noise.perm[jj]], x0, y0);
                }

                var t1 = 0.5 - x1 * x1 - y1 * y1;
                if (t1 < 0.0) {
                    n1 = 0.0;
                } else {
                    t1 *= t1;
                    n1 = t1 * t1 * Noise.grad2(Noise.perm[ii + i1 + Noise.perm[jj + j1]], x1, y1);
                }

                var t2 = 0.5 - x2 * x2 - y2 * y2;
                if (t2 < 0.0) {
                    n2 = 0.0;
                } else {
                    t2 *= t2;
                    n2 = t2 * t2 * Noise.grad2(Noise.perm[ii + 1 + Noise.perm[jj + 1]], x2, y2);
                }

                return 40.0 * (n0 + n1 + n2);
            };

            Noise.generate3 = function (x, y, z) {
                var F3 = 0.333333333;
                var G3 = 0.166666667;

                var n0, n1, n2, n3;

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

                var x1 = x0 - i1 + G3;
                var y1 = y0 - j1 + G3;
                var z1 = z0 - k1 + G3;
                var x2 = x0 - i2 + 2.0 * G3;
                var y2 = y0 - j2 + 2.0 * G3;
                var z2 = z0 - k2 + 2.0 * G3;
                var x3 = x0 - 1.0 + 3.0 * G3;
                var y3 = y0 - 1.0 + 3.0 * G3;
                var z3 = z0 - 1.0 + 3.0 * G3;

                var ii = Noise.Mod(i, 256);
                var jj = Noise.Mod(j, 256);
                var kk = Noise.Mod(k, 256);

                var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
                if (t0 < 0.0) {
                    n0 = 0.0;
                } else {
                    t0 *= t0;
                    n0 = t0 * t0 * Noise.grad3(Noise.perm[ii + Noise.perm[jj + Noise.perm[kk]]], x0, y0, z0);
                }

                var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
                if (t1 < 0.0) {
                    n1 = 0.0;
                } else {
                    t1 *= t1;
                    n1 = t1 * t1 * Noise.grad3(Noise.perm[ii + i1 + Noise.perm[jj + j1 + Noise.perm[kk + k1]]], x1, y1, z1);
                }

                var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
                if (t2 < 0.0) {
                    n2 = 0.0;
                } else {
                    t2 *= t2;
                    n2 = t2 * t2 * Noise.grad3(Noise.perm[ii + i2 + Noise.perm[jj + j2 + Noise.perm[kk + k2]]], x2, y2, z2);
                }

                var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
                if (t3 < 0.0) {
                    n3 = 0.0;
                } else {
                    t3 *= t3;
                    n3 = t3 * t3 * Noise.grad3(Noise.perm[ii + 1 + Noise.perm[jj + 1 + Noise.perm[kk + 1]]], x3, y3, z3);
                }

                return 32.0 * (n0 + n1 + n2 + n3);
            };

            Noise.Mod = function (x, m) {
                var a = x % m;
                return a < 0 ? a + m : a;
            };

            Noise.grad1 = function (hash, x) {
                var h = hash & 15;
                var grad = 1.0 + (h & 7);
                if ((h & 8) !== 0)
                    grad = -grad;
                return (grad * x);
            };

            Noise.grad2 = function (hash, x, y) {
                var h = hash & 7;
                var u = h < 4 ? x : y;
                var v = h < 4 ? y : x;
                return ((h & 1) !== 0 ? -u : u) + ((h & 2) !== 0 ? -2.0 * v : 2.0 * v);
            };

            Noise.grad3 = function (hash, x, y, z) {
                var h = hash & 15;
                var u = h < 8 ? x : y;
                var v = h < 4 ? y : h === 12 || h === 14 ? x : z;
                return ((h & 1) !== 0 ? -u : u) + ((h & 2) !== 0 ? -v : v);
            };

            Noise.grad4 = function (hash, x, y, z, t) {
                var h = hash & 31;
                var u = h < 24 ? x : y;
                var v = h < 16 ? y : z;
                var w = h < 8 ? z : t;
                return ((h & 1) !== 0 ? -u : u) + ((h & 2) !== 0 ? -v : v) + ((h & 4) !== 0 ? -w : w);
            };
            Noise.perm = [
                151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7,
                225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75,
                0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174,
                20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 22931,
                83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
                65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
                116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202,
                38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
                223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
                129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
                228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
                239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4,
                150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61,
                156, 180, 151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36,
                103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197,
                62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125,
                136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229,
                122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63,
                161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159,
                86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118,
                126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170,
                213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39,
                253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
                242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49,
                192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
                138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
            return Noise;
        })();
        Utils.Noise = Noise;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    HG.settings;
})(HG || (HG = {}));

var HG;
(function (HG) {
    (function (Utils) {
        Utils.defaultSettings = {
            debug: true,
            hgLocale: "locale/HG.locale.json",
            graphics: {
                fullscreen: false,
                fov: 110,
                viewDistance: 5000,
                shadowMapSize: 2048,
                useStaticFramerate: false,
                staticFramerate: 120,
                antialiasing: true,
                resolution: new THREE.Vector2(1280, 720)
            },
            sound: {
                masterVolume: 1,
                channels: {
                    effectsEnvVolume: 0.7,
                    effectsSelfVolume: 0.8,
                    musicVolume: 0.7
                }
            },
            keys: {
                forward: [87, 38],
                backward: [83, 40],
                left: [65, 37],
                right: [68, 39],
                pause: [27],
                lower: [16],
                jump: [32],
                devConsole: [123],
                refresh: [116],
                fullscreen: [122]
            }
        };
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Utils) {
        function rgbToHex(r, g, b) {
            var componentToHex = function (c) {
                c = Math.abs(Math.floor(c));
                if (c > 255)
                    c = 255;
                var hex = c.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            };
            return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
        }
        Utils.rgbToHex = rgbToHex;

        function isFunction(va) {
            return (typeof va === "function");
        }
        Utils.isFunction = isFunction;

        function isUndefined(va) {
            return (typeof va === "undefined");
        }
        Utils.isUndefined = isUndefined;

        function isNumber(va) {
            return (typeof va === "number");
        }
        Utils.isNumber = isNumber;

        function bootstrap(gInstance) {
            if (HG.settings.debug === true) {
                HG.Utils.profile("HG Profiling Frame", function () {
                    return gInstance.render();
                });
            }
            window.onresize = function () {
                return gInstance.onResize();
            };
            window.onkeydown = function (a) {
                return gInstance.onKeyDown(a);
            };
            window.onkeyup = function (a) {
                return gInstance.onKeyUp(a);
            };
            window.onmousemove = function (a) {
                return gInstance.onMouseMove(a);
            };
            window.onmousedown = function (a) {
                return gInstance.onMouseDown(a);
            };
            window.onmouseup = function (a) {
                return gInstance.onMouseUp(a);
            };
            var render;
            if (HG.settings.graphics.useStaticFramerate === true) {
                render = function () {
                    gInstance.render();
                };
                setInterval(render, 1000 / HG.settings.graphics.staticFramerate);
            } else {
                render = function () {
                    gInstance.render();
                    requestAnimationFrame(render);
                };
            }
            render();
        }
        Utils.bootstrap = bootstrap;

        function profile(name, fn) {
            console.profile(name);
            fn();
            console.profileEnd();
        }
        Utils.profile = profile;

        function hasGL() {
            var wnd = (typeof window !== "undefined") ? true : false;
            if (wnd === false) {
                return false;
            } else {
                var gl = (window["WebGLRenderingContext"]) ? true : false;
                return wnd && gl;
            }
        }
        Utils.hasGL = hasGL;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var BaseEntity = (function (_super) {
            __extends(BaseEntity, _super);
            function BaseEntity(object) {
                _super.call(this);
                this.abilities = [];
                this.positionOffset = new THREE.Vector3;
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

            BaseEntity.prototype.load = function (data) {
                return;
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
        })(HG.Core.EventDispatcher);
        Entities.BaseEntity = BaseEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Abilities) {
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
                return;
            };
            return BaseAbility;
        })(HG.Core.EventDispatcher);
        Abilities.BaseAbility = BaseAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Scenes) {
        var BaseScene = (function () {
            function BaseScene() {
                this.controls = new HG.Core.InputHandler();
                this.scene = new Physijs.Scene();
                this.entities = {
                    named: {},
                    unnamed: []
                };
            }
            BaseScene.prototype.add = function (entity, nameTag) {
                this.scene.add(entity.getInternal());
                if (nameTag) {
                    if (this.entities.named[nameTag.toLowerCase()]) {
                        HG.locale.core.errors.duplicateNameTag.error();
                    }
                    this.entities.named[nameTag.toLowerCase()] = entity;
                } else {
                    this.entities.unnamed.push(entity);
                }
            };

            BaseScene.prototype.merge = function (otherScene) {
            };

            BaseScene.prototype.getAllNamed = function (type) {
                if (typeof type === "undefined") { type = HG.Entities.BaseEntity; }
                var es = [];
                for (var k in this.entities.named) {
                    var v = this.entities.named[k];
                    if (v instanceof type)
                        es.push(v);
                }
                return es;
            };

            BaseScene.prototype.getAllUnnamed = function (type) {
                if (typeof type === "undefined") { type = HG.Entities.BaseEntity; }
                var es = [];
                this.entities.unnamed.forEach(function (e) {
                    if (e instanceof type)
                        es.push(e);
                });
                return es;
            };

            BaseScene.prototype.getAll = function (type) {
                if (typeof type === "undefined") { type = HG.Entities.BaseEntity; }
                var es = [];
                es.concat(this.getAllUnnamed(type));
                es.concat(this.getAllNamed(type));
                return es;
            };

            BaseScene.prototype.forNamed = function (callback, type) {
                if (!type)
                    type = HG.Entities.BaseEntity;
                for (var k in this.entities.named) {
                    var ne = this.entities.named[k];
                    if (ne instanceof type)
                        callback(ne, k);
                }
            };

            BaseScene.prototype.forUnamed = function (callback, type) {
                if (!type)
                    type = HG.Entities.BaseEntity;
                this.entities.unnamed.forEach(function (e) {
                    if (e instanceof type)
                        callback(e);
                });
            };

            BaseScene.prototype.forAll = function (callback, type) {
                if (typeof type === "undefined") { type = HG.Entities.BaseEntity; }
                this.forNamed(callback, type);
                this.forUnamed(callback, type);
            };

            BaseScene.prototype.getInternal = function () {
                return this.scene;
            };

            BaseScene.prototype.get = function (nameTag, type) {
                if (typeof type === "undefined") { type = HG.Entities.BaseEntity; }
                var e = [];
                for (var i = 0; i < nameTag.length; i++) {
                    var ee = this.entities.named[nameTag[i].toLowerCase()];
                    if (ee instanceof type)
                        e.push(ee);
                }
                return e;
            };
            return BaseScene;
        })();
        Scenes.BaseScene = BaseScene;
    })(HG.Scenes || (HG.Scenes = {}));
    var Scenes = HG.Scenes;
})(HG || (HG = {}));

var HG;
(function (HG) {
    HG._start = 0;
    HG._gl = false;
    HG._options = {
        silent: false
    };

    function warn() {
        var data = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            data[_i] = arguments[_i + 0];
        }
        var time = new Date().getTime() - HG._start;
        var timeString = (time + "");
        var output = "[" + timeString + "] " + data.join("");
        if (HG._options.silent === false) {
            console.warn(output);
        }
        return data.join("");
    }
    HG.warn = warn;

    function forceLog() {
        var data = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            data[_i] = arguments[_i + 0];
        }
        var time = new Date().getTime() - HG._start;
        var timeString = (time + "");
        var output = "[" + timeString + "] " + data.join("");
        console.log(output);
        return data.join("");
    }
    HG.forceLog = forceLog;

    function log() {
        var data = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            data[_i] = arguments[_i + 0];
        }
        var time = new Date().getTime() - HG._start;
        var timeString = (time + "");
        var output = "[" + timeString + "] " + data.join("");
        if (HG._options.silent === false) {
            console.log(output);
        }
        return data.join("");
    }
    HG.log = log;

    function horrible(options) {
        HG._start = new Date().getTime();
        if (options)
            HG._options = options;
        try  {
            HG.Modules.ui = require("nw.gui");
        } catch (e) {
            HG.log("UI not available, assuming Headless");
        }

        HG.LINQ.initialize();

        HG._gl = HG.Utils.hasGL();

        if (typeof window !== "undefined") {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
        }
        return HG;
    }
    HG.horrible = horrible;
})(HG || (HG = {}));

var $;
if (typeof document !== "undefined") {
    $ = function (id) {
        return document.getElementById.call(document, id);
    };
}

if (typeof module !== "undefined") {
    module.exports = {
        horrible: HG.horrible
    };
}
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
                this.events = ["loaded"];
            }
            AnimationAbility.prototype.setHost = function (entity) {
                this.hostEntity = entity;
            };

            AnimationAbility.prototype.checkCompatibility = function (entity) {
                return (entity instanceof HG.Entities.MeshEntity);
            };

            AnimationAbility.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
                if (this.running === true) {
                    var time = new Date().getTime() % this.duration;
                    var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
                    if (keyframe !== this.currentKeyframe) {
                        this.hostEntity.object["morphTargetInfluences"][this.lastKeyframe] = 0;
                        this.hostEntity.object["morphTargetInfluences"][this.currentKeyframe] = 1;
                        this.hostEntity.object["morphTargetInfluences"][keyframe] = 0;
                        this.lastKeyframe = this.currentKeyframe;
                        this.currentKeyframe = keyframe;
                    }
                    this.hostEntity.object["morphTargetInfluences"][keyframe] = (time % this.interpolation) / this.interpolation;
                    this.hostEntity.object["morphTargetInfluences"][this.lastKeyframe] = 1 - this.hostEntity.object["morphTargetInfluences"][keyframe];
                    this.running = false;
                }
            };
            return AnimationAbility;
        })(HG.Abilities.BaseAbility);
        Abilities.AnimationAbility = AnimationAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Abilities) {
        var MovingAbility = (function (_super) {
            __extends(MovingAbility, _super);
            function MovingAbility() {
                _super.apply(this, arguments);
                this.jumpState = 0;
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
        })(HG.Abilities.BaseAbility);
        Abilities.MovingAbility = MovingAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Core) {
        var BaseGame = (function (_super) {
            __extends(BaseGame, _super);
            function BaseGame(container) {
                _super.call(this);
                this._running = false;
                this.events = [
                    "load", "connected", "start", "keyup", "keydown",
                    "resize", "render", "mouseDown", "mouseUp",
                    "mouseMove", "preRender", "postRender"];
                if (!HG.settings) {
                    HG.settings = HG.Utils.defaultSettings;
                    HG.locale.core.errors.defaultSettingsUsed.warn();
                }
                new HG.Utils.UpdateChecker();
                this.controls = new HG.Core.InputHandler();
                this.pluginHost = new HG.Core.PluginHost(this);
                this.fpsCounter = new HG.Utils.FPSCounter();

                this.soundMixer = new HG.Sound.Mixer();
                this.soundMixer.volume(HG.settings.sound.masterVolume);

                for (var c in HG.settings.sound.channels) {
                    var ch = new HG.Sound.Channel(c.replace("Volume", ""));
                    ch.volume(HG.settings.sound.channels[c]);
                    this.soundMixer.addChannel(ch);
                }

                this.setFullScreenMode(HG.settings.graphics.fullscreen);
                this.resize(HG.settings.graphics.resolution);

                this.camera = new HG.Entities.CameraEntity(HG.settings.graphics.fov, window.innerWidth / window.innerHeight, 0.1, HG.settings.graphics.viewDistance);
                this.renderer = new THREE.WebGLRenderer({
                    antialias: HG.settings.graphics.antialiasing
                });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(this.renderer.domElement);
            }
            Object.defineProperty(BaseGame.prototype, "title", {
                set: function (v) {
                    document.title = v.join("");
                },
                enumerable: true,
                configurable: true
            });

            BaseGame.prototype.scene = function (scene) {
                this.pluginHost.dispatch("sceneChange", scene);
                this.currentScene = scene;
            };

            BaseGame.prototype.screenshot = function (path, imageType) {
                if (typeof imageType === "undefined") { imageType = "image/png"; }
                var data = this.renderer.domElement.toDataURL(imageType);

                var raw = new Buffer(data.replace("data:" + imageType + ";base64,", ""), "base64");
                HG.Modules.fs.writeFile(path, raw);
            };

            BaseGame.prototype.load = function () {
                console.time("HG.loadResources");
                this.dispatch("load");
                console.timeEnd("HG.loadResources");
            };

            BaseGame.prototype.resize = function (resolution) {
                var whwnd = HG.Modules.ui.Window.get();
                whwnd.width = resolution.x;
                whwnd.height = resolution.y;
            };

            BaseGame.prototype.position = function (position) {
                var whwnd = HG.Modules.ui.Window.get();
                whwnd.x = position.x;
                whwnd.y = position.y;
            };

            BaseGame.prototype.setFullScreenMode = function (state) {
                var whwnd = HG.Modules.ui.Window.get();
                if (state === true) {
                    whwnd.enterFullscreen();
                } else {
                    whwnd.leaveFullscreen();
                }
            };

            BaseGame.prototype.reload = function () {
                var whwnd = HG.Modules.ui.Window.get();
                whwnd.reloadIgnoringCache();
            };

            BaseGame.prototype.toggleFullScreenMode = function () {
                var whwnd = HG.Modules.ui.Window.get();
                whwnd.toggleFullscreen();
            };

            BaseGame.prototype.openDevConsole = function () {
                HG.Modules.ui.Window.get().showDevTools();
            };

            BaseGame.prototype.start = function () {
                this.dispatch("start");
                this._running = true;
            };

            BaseGame.prototype.onKeyUp = function (e) {
                this.controls.onKeyUp(e);
                this.currentScene.controls.onKeyUp(e);
                this.dispatch("keyUp", e);
            };

            BaseGame.prototype.onKeyDown = function (e) {
                this.controls.onKeyDown(e);
                this.currentScene.controls.onKeyDown(e);
                this.dispatch("keyDown", e);
            };

            BaseGame.prototype.onMouseDown = function (e) {
                this.controls.onMouseDown(e);
                this.currentScene.controls.onMouseDown(e);
                this.dispatch("mouseDown", e);
            };

            BaseGame.prototype.onMouseUp = function (e) {
                this.controls.onMouseUp(e);
                this.currentScene.controls.onMouseUp(e);
                this.dispatch("mouseUp", e);
            };

            BaseGame.prototype.onMouseMove = function (e) {
                this.controls.onMouseMove(e);
                this.currentScene.controls.onMouseMove(e);
                this.dispatch("mouseMove", e);
            };

            BaseGame.prototype.onResize = function () {
                this.dispatch("resize");
                this.camera.resize(window.innerWidth / window.innerHeight);
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            };

            BaseGame.prototype.render = function () {
                var delta = this.fpsCounter.frameTime / 10;
                this.dispatch("preRender", delta);
                this.dispatch("render", delta);
                this.currentScene.forNamed(function (e) {
                    return e.frame(delta);
                });
                this.currentScene.controls.frame(delta);
                this.camera.frame(delta);
                this.controls.frame(delta);
                this.fpsCounter.frame(delta);
                this.currentScene.getInternal().simulate();
                this.renderer.render(this.currentScene.getInternal(), this.camera.getInternal());
                this.dispatch("postRender", delta);
            };
            return BaseGame;
        })(HG.Core.EventDispatcher);
        Core.BaseGame = BaseGame;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Core) {
        var BaseServer = (function (_super) {
            __extends(BaseServer, _super);
            function BaseServer(port) {
                _super.call(this);
                this.clients = [];
                HG.Modules.net.createServer(this.onSocket).listen(port);
            }
            BaseServer.prototype.broadcast = function (message, sender) {
                this.clients.forEach(function (client) {
                    if (client !== sender) {
                        client.write(message);
                    }
                });
                HG.log(message);
            };

            BaseServer.prototype.onSocket = function (socket) {
                socket.name = socket.remoteAddress + ":" + socket.remotePort;

                this.clients.push(new HG.Core.ServerConnection(socket));
            };
            return BaseServer;
        })(HG.Core.EventDispatcher);
        Core.BaseServer = BaseServer;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Core) {
        var InputHandler = (function () {
            function InputHandler() {
                this.keyState = [];
                this.mouseState = [];
                this.mouse = new HG.Core.EventDispatcher(["x", "y", "move"]);
                this.keyboard = new HG.Core.EventDispatcher();
                this._mouse = new THREE.Vector2();
                for (var k in HG.Utils.KEY_MAP) {
                    this.keyboard.events.push(HG.Utils.KEY_MAP[k.toString()]);
                }
            }
            Object.defineProperty(InputHandler.prototype, "mousePosition", {
                get: function () {
                    return this._mouse;
                },
                enumerable: true,
                configurable: true
            });

            InputHandler.prototype.onMouseMove = function (e) {
                var x = e.x || e.clientX;
                var y = e.y || e.clientY;
                if (x !== this._mouse.x) {
                    var diffX = this._mouse.x - x;
                    this._mouse.x = x;
                    this.mouse.dispatch("x", diffX, x);
                }
                if (y !== this._mouse.y) {
                    var diffY = this._mouse.y - y;
                    this._mouse.y = y;
                    this.mouse.dispatch("y", diffY, y);
                }
                this.mouse.dispatch("move", x, y);
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
                        _this.keyboard.dispatch(i, delta);
                });
                this.mouseState.forEach(function (s, i) {
                    if (s === 1)
                        _this.mouse.dispatch(i, delta);
                });
            };
            return InputHandler;
        })();
        Core.InputHandler = InputHandler;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Core) {
        var ServerConnection = (function (_super) {
            __extends(ServerConnection, _super);
            function ServerConnection(socket) {
                _super.call(this);
                this.write = this.socket.write;
                this.socket = socket;
            }
            return ServerConnection;
        })(HG.Core.EventDispatcher);
        Core.ServerConnection = ServerConnection;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Core) {
        var Shader = (function (_super) {
            __extends(Shader, _super);
            function Shader(path) {
                _super.call(this);
                if (path) {
                    var shader = require("./" + path);
                    this.load(shader);
                }
            }
            Shader.prototype.load = function (raw) {
                this.vertexShader = raw["vertex"];
                this.fragmentShader = raw["fragment"];
                this.dispatch("loaded");
            };
            return Shader;
        })(HG.Core.EventDispatcher);
        Core.Shader = Shader;
    })(HG.Core || (HG.Core = {}));
    var Core = HG.Core;
})(HG || (HG = {}));
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
        })(HG.Entities.BaseEntity);
        Entities.CameraEntity = CameraEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
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
        })(HG.Entities.CameraEntity);
        Entities.ChasingCameraEntity = ChasingCameraEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
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
                this.PI_2 = Math.PI / 2;
                this.object = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
                this.pitchObject = new THREE.Object3D();
                this.pitchObject.add(this.object);
                this.yawObject = new THREE.Object3D();
                this.yawObject.position.y = 10;
                this.yawObject.add(this.object);
                this.velocity = new THREE.Vector3();
            }
            FirstPersonCameraEntity.prototype.onMouseMove = function (x, y) {
                this.yawObject.rotation.y -= x * 0.002;
                this.pitchObject.rotation.x -= y * 0.002;

                this.pitchObject.rotation.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.pitchObject.rotation.x));
            };

            FirstPersonCameraEntity.prototype.setViewDistance = function (d) {
                this.object.far = d;
                this.object.updateProjectionMatrix();
            };

            FirstPersonCameraEntity.prototype.frame = function (delta) {
                var cameraOffset = this.positionOffset.clone().applyMatrix4(this.target.object.matrixWorld);
                this.velocity.x += (-this.velocity.x) * 0.08 * delta;
                this.velocity.z += (-this.velocity.z) * 0.08 * delta;

                this.velocity.y -= 0.25 * delta;

                this.yawObject.translateX(this.velocity.x);
                this.yawObject.translateY(this.velocity.y);
                this.yawObject.translateZ(this.velocity.z);

                if (this.yawObject.position.y < 10) {
                    this.velocity.y = 0;
                    this.yawObject.position.y = 10;
                }
            };
            return FirstPersonCameraEntity;
        })(HG.Entities.CameraEntity);
        Entities.FirstPersonCameraEntity = FirstPersonCameraEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
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
        })(HG.Entities.BaseEntity);
        Entities.HeightMapEntity = HeightMapEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var MeshEntity = (function (_super) {
            __extends(MeshEntity, _super);
            function MeshEntity(geo, mat) {
                _super.call(this);
                this.events = ["loaded"];
                if (geo && mat)
                    this.object = new THREE.Mesh(geo, mat);
            }
            MeshEntity.prototype.load = function (data) {
                var material = data["material"];
                if (Array.isArray(material)) {
                    material.forEach(function (material) {
                        material.morphTargets = true;
                    });
                    var meshMaterial = new THREE.MeshFaceMaterial(material);
                    this.object = new THREE.Mesh(data["geometry"], meshMaterial);
                } else {
                    this.object = new THREE.Mesh(data["geometry"], material);
                }
                this.dispatch("loaded", data["geometry"], data["material"]);
            };
            return MeshEntity;
        })(HG.Entities.BaseEntity);
        Entities.MeshEntity = MeshEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
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
        })(HG.Entities.BaseEntity);
        Entities.ParticleEntity = ParticleEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var SpriteEntity = (function (_super) {
            __extends(SpriteEntity, _super);
            function SpriteEntity(canvas, alignment) {
                if (typeof alignment === "undefined") { alignment = THREE.SpriteAlignment.topLeft; }
                _super.call(this);
                var texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;

                var spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    useScreenCoordinates: false,
                    alignment: alignment
                });
                var sprite = new THREE.Sprite(spriteMaterial);
            }
            return SpriteEntity;
        })(HG.Entities.BaseEntity);
        Entities.SpriteEntity = SpriteEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var VideoEntity = (function (_super) {
            __extends(VideoEntity, _super);
            function VideoEntity(url) {
                _super.call(this);
            }
            return VideoEntity;
        })(HG.Entities.BaseEntity);
        Entities.VideoEntity = VideoEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (LINQ) {
        var ArrayProvider = (function () {
            function ArrayProvider() {
                this._prototype = Array.prototype;
            }
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
            return ArrayProvider;
        })();
        LINQ.ArrayProvider = ArrayProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (LINQ) {
        function initialize() {
            var registerFunction = function (key, type, fn) {
                type[key] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.splice(0, 0, this);
                    return fn.apply(this, args);
                };
            };
            for (var type in HG.LINQ) {
                if (type.toString() !== "initialize") {
                    var provider = new HG.LINQ[type]();
                    var prototype = provider._prototype;
                    for (var method in provider) {
                        if (method !== "_prototype") {
                            registerFunction(method, prototype, provider[method]);
                        }
                    }
                }
            }
        }
        LINQ.initialize = initialize;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (LINQ) {
        var NumberProvider = (function () {
            function NumberProvider() {
                this._prototype = Number.prototype;
            }
            NumberProvider.prototype.toRadian = function (nmb) {
                return nmb * (Math.PI / 180);
            };

            NumberProvider.prototype.toDegrees = function (nmb) {
                return nmb * (180 / Math.PI);
            };
            return NumberProvider;
        })();
        LINQ.NumberProvider = NumberProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (LINQ) {
        var ObjectProvider = (function () {
            function ObjectProvider() {
                this._prototype = Object.prototype;
            }
            return ObjectProvider;
        })();
        LINQ.ObjectProvider = ObjectProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (LINQ) {
        var StringProvider = (function () {
            function StringProvider() {
                this._prototype = String.prototype;
                this.f = this.format;
            }
            StringProvider.prototype.format = function (context, arg1) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 2); _i++) {
                    args[_i] = arguments[_i + 2];
                }
                if (args.length > 0 || typeof arg1 === "number" || typeof arg1 === "string") {
                    context = context.replaceAll("${0}", arg1);
                    args.forEach(function (arg, index) {
                        context = context.replaceAll("${" + (index + 1) + "}", arg);
                    });
                } else {
                    for (var k in arg1) {
                        context = context.replaceAll("${" + k + "}", arg1[k]);
                    }
                }
                return context;
            };

            StringProvider.prototype.log = function (context) {
                HG.log(context);
            };

            StringProvider.prototype.warn = function (context) {
                HG.warn(context);
            };

            StringProvider.prototype.error = function (context) {
                throw new Error(context);
            };

            StringProvider.prototype.lengthen = function (context, length, filler) {
                filler = filler || " ";
                var diff = length - context.length;
                HG.log(diff);
                for (var i = 0; i < diff; i++) {
                    context += filler;
                }
                return context;
            };

            StringProvider.prototype.replaceAll = function (context, find, replace) {
                if (typeof find === "string") {
                    find = find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                } else {
                    find = find.source;
                }
                return context.replace(new RegExp(find, "g"), replace);
            };
            return StringProvider;
        })();
        LINQ.StringProvider = StringProvider;
    })(HG.LINQ || (HG.LINQ = {}));
    var LINQ = HG.LINQ;
})(HG || (HG = {}));
var HG;
(function (HG) {
    HG.locale;
})(HG || (HG = {}));

var HG;
(function (HG) {
    (function (_Locale) {
        var Locale = (function () {
            function Locale() {
            }
            return Locale;
        })();
        _Locale.Locale = Locale;
    })(HG.Locale || (HG.Locale = {}));
    var Locale = HG.Locale;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Resource) {
        (function (Model) {
            var JS = (function (_super) {
                __extends(JS, _super);
                function JS() {
                    _super.apply(this, arguments);
                    this.events = ["loaded"];
                }
                JS.prototype.load = function (path) {
                    var _this = this;
                    var loader = new THREE.JSONLoader();
                    loader.load(path, function (geometry, material) {
                        var model = {
                            geometry: geometry,
                            material: material
                        };
                        _this.dispatch("loaded", model);
                    });
                };
                return JS;
            })(HG.Core.EventDispatcher);
            Model.JS = JS;
        })(Resource.Model || (Resource.Model = {}));
        var Model = Resource.Model;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Resource) {
        (function (Model) {
            var STL = (function (_super) {
                __extends(STL, _super);
                function STL() {
                    _super.apply(this, arguments);
                    this.events = ["loaded"];
                }
                STL.prototype.load = function (path, material) {
                    var _this = this;
                    var loader = new THREE.STLLoader();
                    loader.addEventListener("load", function (event) {
                        var geometry = event.content;
                        var phong = new THREE.MeshPhongMaterial({
                            ambient: 0xff5533,
                            color: 0xff5533,
                            specular: 0x111111,
                            shininess: 200
                        });
                        var material = new THREE.MeshFaceMaterial([phong]);

                        var model = {
                            geometry: geometry,
                            material: material
                        };
                        _this.dispatch("loaded", model);
                    });
                    loader.load(path);
                };
                return STL;
            })(HG.Core.EventDispatcher);
            Model.STL = STL;
        })(Resource.Model || (Resource.Model = {}));
        var Model = Resource.Model;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Resource) {
        var ResourceLoader = (function (_super) {
            __extends(ResourceLoader, _super);
            function ResourceLoader(baseDirectory) {
                _super.call(this);
                this.baseDirectory = baseDirectory;
                var suspectSettingsFile = "settings.json";
                var settingsPath = HG.Modules.path.join(this.baseDirectory, suspectSettingsFile);
                if (HG.Modules.fs.existsSync(settingsPath) === true) {
                    this.settings(suspectSettingsFile);
                }
            }
            ResourceLoader.prototype.resolvePath = function (path) {
                var absPath = HG.Modules.path.join(this.baseDirectory, path);
                if (HG.Modules.fs.existsSync(absPath) === true) {
                    return absPath;
                } else {
                    return "";
                }
            };

            ResourceLoader.prototype.load = function (relPath, namespace, target) {
                var absPath = HG.Modules.path.join(this.baseDirectory, relPath);
                var extension = HG.Modules.path.extname(absPath);
                var extensionName = extension.toUpperCase().replace(".", "");
                var foundLoader = false;
                var isOk = false;
                for (var k in namespace) {
                    if (k === extensionName) {
                        var loader = new namespace[k]();
                        var handler;
                        if (target["load"]) {
                            handler = function (data) {
                                target.load(data);
                            };
                        } else {
                            handler = function (data) {
                                target(data);
                            };
                        }
                        loader.on("loaded", handler);
                        loader.load(absPath);
                        foundLoader = true;
                    }
                }
                if (foundLoader === false) {
                    HG.locale.resource.noLoader.f(extension).error();
                }
            };

            ResourceLoader.prototype.model = function (path, entitiy) {
                this.load(path, HG.Resource.Model, entitiy);
            };

            ResourceLoader.prototype.texture = function (path, entitiy) {
                this.load(path, HG.Resource.Texture, entitiy);
            };

            ResourceLoader.prototype.sound = function (path, effect) {
                this.load(path, HG.Resource.Sound, effect);
            };

            ResourceLoader.prototype.scene = function (path, done) {
                this.load(path, HG.Resource.Scene, done);
            };

            ResourceLoader.prototype.json = function (path) {
                var realPath = HG.Modules.path.join(this.baseDirectory, path);
                if (HG.Modules.fs.existsSync(realPath) === true) {
                    var raw = HG.Modules.fs.readFileSync(realPath);
                    return JSON.parse(raw);
                } else {
                    return null;
                }
            };

            ResourceLoader.prototype.settings = function (path) {
                var absPath = HG.Modules.path.join(this.baseDirectory, path);
                var raw = HG.Modules.fs.readFileSync(absPath);
                HG.settings = JSON.parse(raw);
                var localePath = HG.Modules.path.join(this.baseDirectory, HG.settings.hgLocale);
                HG.locale = JSON.parse(HG.Modules.fs.readFileSync(localePath));
            };

            ResourceLoader.prototype.directory = function (directory) {
                var _this = this;
                var path = HG.Modules.path.join(this.baseDirectory, directory);
                var files = HG.Modules.fs.readdirSync(path);
                var realFiles = [];
                files.forEach(function (file) {
                    realFiles.push(HG.Modules.path.join(_this.baseDirectory, directory, file));
                });
                return realFiles;
            };
            return ResourceLoader;
        })(HG.Core.EventDispatcher);
        Resource.ResourceLoader = ResourceLoader;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Resource) {
        (function (_Scene) {
            var Scene = (function (_super) {
                __extends(Scene, _super);
                function Scene() {
                    _super.apply(this, arguments);
                    this.events = ["loaded"];
                }
                Scene.prototype.load = function (path) {
                };
                return Scene;
            })(HG.Core.EventDispatcher);
            _Scene.Scene = Scene;
        })(Resource.Scene || (Resource.Scene = {}));
        var Scene = Resource.Scene;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Resource) {
        (function (Sound) {
            var WAV = (function (_super) {
                __extends(WAV, _super);
                function WAV() {
                    _super.apply(this, arguments);
                    this.events = ["loaded"];
                }
                WAV.prototype.load = function (path) {
                    var _this = this;
                    var request = new XMLHttpRequest();
                    request.open("GET", path, true);
                    request.responseType = "arraybuffer";

                    request.onload = function () {
                        new AudioContext().decodeAudioData(request.response, function (buffer) {
                            _this.dispatch("loaded", buffer);
                        }, function (error) {
                            console.error("decodeAudioData error", error);
                        });
                    };

                    request.send();
                };
                return WAV;
            })(HG.Core.EventDispatcher);
            Sound.WAV = WAV;
        })(Resource.Sound || (Resource.Sound = {}));
        var Sound = Resource.Sound;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Resource) {
        (function (Texture) {
            var PNG = (function (_super) {
                __extends(PNG, _super);
                function PNG() {
                    _super.apply(this, arguments);
                    this.events = ["loaded"];
                }
                PNG.prototype.load = function (path) {
                    var loader = new THREE.ImageLoader();
                    HG.locale.core.errors.notImplementedError.error();
                };
                return PNG;
            })(HG.Core.EventDispatcher);
            Texture.PNG = PNG;
        })(Resource.Texture || (Resource.Texture = {}));
        var Texture = Resource.Texture;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Scenes) {
        var GameScene = (function (_super) {
            __extends(GameScene, _super);
            function GameScene() {
                _super.apply(this, arguments);
            }
            return GameScene;
        })(HG.Scenes.BaseScene);
        Scenes.GameScene = GameScene;
    })(HG.Scenes || (HG.Scenes = {}));
    var Scenes = HG.Scenes;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Sound) {
        var Channel = (function (_super) {
            __extends(Channel, _super);
            function Channel(name) {
                _super.call(this, ["volumeChange"]);
                this.name = name;
            }
            Object.defineProperty(Channel.prototype, "gain", {
                get: function () {
                    return this.gainNode.gain.value || 0;
                },
                enumerable: true,
                configurable: true
            });

            Channel.prototype.effect = function () {
                var fx = new HG.Sound.Effect(this);
                this.children.push(fx);
                return fx;
            };

            Channel.prototype.volume = function (gain) {
                if (this.gainNode) {
                    this.gainNode.gain.value = gain;
                    if (this.children.length > 0)
                        this.children.forEach(function (child) {
                            return child.volume(gain);
                        });
                }
            };
            return Channel;
        })(HG.Core.EventDispatcher);
        Sound.Channel = Channel;
    })(HG.Sound || (HG.Sound = {}));
    var Sound = HG.Sound;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Sound) {
        var Effect = (function () {
            function Effect(ch) {
                this.destination = ch;
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

            Effect.prototype.load = function (data) {
                this.source = this.rootContext.createBufferSource();
                this.buffer = data;
                this.source.buffer = data;
                this.source.connect(this.gainNode);
            };

            Effect.prototype.recreate = function () {
                this.source = this.rootContext.createBufferSource();
                if (this.buffer !== null)
                    this.source.buffer = this.buffer;
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
                this.gainNode.gain.value = gain;
            };
            return Effect;
        })();
        Sound.Effect = Effect;
    })(HG.Sound || (HG.Sound = {}));
    var Sound = HG.Sound;
})(HG || (HG = {}));
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

            Mixer.prototype.channel = function (name) {
                if (name in this.channels) {
                    return this.channels[name];
                } else {
                    return null;
                }
            };

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
var HG;
(function (HG) {
    (function (Utils) {
        var CanvasUtils = (function () {
            function CanvasUtils() {
            }
            CanvasUtils.roundRect = function (ctx, x, y, w, h, r) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
            return CanvasUtils;
        })();
        Utils.CanvasUtils = CanvasUtils;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Utils) {
        var UpdateChecker = (function () {
            function UpdateChecker() {
                this.threeUrl = "https://api.github.com/repos/mrdoob/three.js/releases";
                this.checkThree(function (downloadUrl, version) {
                    HG.locale.utils.updateChecker.newThree.f(version, downloadUrl).log();
                }, function (version) {
                    HG.locale.utils.updateChecker.noThree.f(version).log();
                });
            }
            UpdateChecker.prototype.downloadString = function (url, fn) {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function (req) {
                    if (this.readyState === 4) {
                        fn(JSON.parse(this.responseText));
                    }
                };
                req.open("GET", url, true);
                req.send();
            };

            UpdateChecker.prototype.checkThree = function (onNew, noNew) {
                this.downloadString(this.threeUrl, function (res) {
                    var latest = res[0];
                    var revision = parseInt(latest["name"].replace("r", ""), 0);
                    var threer = parseInt(THREE.REVISION, 0);
                    if (revision > threer) {
                        onNew(latest["html_url"], latest["name"]);
                    } else {
                        noNew(latest["name"]);
                    }
                });
            };
            return UpdateChecker;
        })();
        Utils.UpdateChecker = UpdateChecker;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
//# sourceMappingURL=hg.js.map
