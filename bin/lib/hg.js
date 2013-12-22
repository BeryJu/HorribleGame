var HG;
(function (HG) {
    (function (Core) {
        var EventDispatcher = (function () {
            function EventDispatcher(events) {
                this._events = {};
                this._globalEvents = [];
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

            EventDispatcher.prototype.merge = function (otherDispatcher) {
                var newDispatcher = new HG.Core.EventDispatcher();
                newDispatcher.events = this.events.concat(otherDispatcher.events);
                for (var k in otherDispatcher._events) {
                    newDispatcher._events[k] = otherDispatcher._events[k];
                }
                for (var k in this._events) {
                    newDispatcher._events[k] = this._events[k];
                }
                newDispatcher._globalEvents = this._globalEvents.concat(otherDispatcher._globalEvents);
                return newDispatcher;
            };

            EventDispatcher.prototype.every = function (eventHandler) {
                this._globalEvents.push(eventHandler);
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
                    this._globalEvents.forEach(function (event) {
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
            PluginHost.prototype.load = function (path, env) {
                var _this = this;
                env = {
                    HG: HG,
                    THREE: THREE,
                    game: this.game,
                    window: window,
                    document: document
                } || env;
                path.forEach(function (file) {
                    var plugin = require("./" + file);
                    var instance = new plugin(_this, env);
                    HG.locale.pluginHost.success.f(instance.name).log();
                    _this.plugins.push(instance);
                    _this.paths.push(file);
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
                aa: 16,
                viewDistance: 5000,
                shadowMapSize: 2048,
                useStaticFramerate: false,
                staticFramerate: 120,
                antialiasing: true,
                resolution: new THREE.Vector2(1280, 720),
                devToolsResolution: new THREE.Vector2(1600, 900)
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

        function parseColor(raw) {
            var color = new THREE.Color(0xaabbcc);
            if (Array.isArray(raw) === true) {
                color.setRGB.apply(color, raw);
            } else {
                color.setHex(raw);
            }
            return color;
        }
        Utils.parseColor = parseColor;

        function isFunction(va) {
            return (typeof va === "function");
        }
        Utils.isFunction = isFunction;

        function isNumber(va) {
            return (typeof va === "number");
        }
        Utils.isNumber = isNumber;

        function devTools() {
            var whnd = HG.Modules.ui.Window.get();
            var devToolsWindow = whnd.showDevTools();
            devToolsWindow.resizeTo(HG.settings.graphics.devToolsResolution.x, HG.settings.graphics.devToolsResolution.y);
            devToolsWindow.setPosition("center");
            return devToolsWindow;
        }
        Utils.devTools = devTools;

        function profile(label, fn) {
            console.profile(label);
            fn();
            console.profileEnd();
        }
        Utils.profile = profile;

        function time(label, fn) {
            console.time(label);
            fn();
            console.timeEnd(label);
        }
        Utils.time = time;

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
                this.nwUrl = "https://api.github.com/repos/rogerwang/node-webkit/releases";
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
var HG;
(function (HG) {
    (function (Utils) {
        function queue(functions, done) {
            var allData = [];
            var next = function (index, data) {
                if (index !== 0) {
                    allData[index - 1] = data;
                }
                var func = functions[index];
                if (index < functions.length) {
                    index++;
                    func(function (data) {
                        next(index, data);
                    });
                } else {
                    done(allData);
                }
                return index;
            };
            next(0);
        }
        Utils.queue = queue;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Utils) {
        var Tween = (function () {
            function Tween(timeArray, valueArray) {
                this.timeArray = [];
                this.valueArray = [];
                if (timeArray)
                    this.timeArray = timeArray;
                if (valueArray)
                    this.valueArray = valueArray;
            }
            Tween.prototype.lerp = function (t) {
                var i = 0;
                var n = this.timeArray.length;
                while (i < n && t > this.timeArray[i]) {
                    i++;
                }
                if (i === 0)
                    return this.valueArray[0];
                if (i === n)
                    return this.valueArray[n - 1];
                var p = (t - this.timeArray[i - 1]) / (this.timeArray[i] - this.timeArray[i - 1]);
                if (this.valueArray[0] instanceof THREE.Vector3) {
                    return this.valueArray[i - 1].clone().lerp(this.valueArray[i], p);
                } else {
                    return this.valueArray[i - 1] + p * (this.valueArray[i] - this.valueArray[i - 1]);
                }
            };
            return Tween;
        })();
        Utils.Tween = Tween;
    })(HG.Utils || (HG.Utils = {}));
    var Utils = HG.Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var Entity = (function (_super) {
            __extends(Entity, _super);
            function Entity(object) {
                _super.call(this);
                this.abilities = [];
                this.positionOffset = new THREE.Vector3();
                this.velocity = new THREE.Vector3();
                if (object) {
                    this.object = object;
                } else {
                    this.object = new THREE.Mesh();
                }
            }
            Entity.prototype.ability = function (a) {
                var compatible = a.checkCompatibility(this);
                if (compatible === true) {
                    a.setHost(this);
                    this.abilities.push(a);
                }
                return compatible;
            };

            Entity.prototype.forAbilities = function (callback) {
                this.abilities.forEach(callback);
            };

            Entity.prototype.offset = function (x, y, z) {
                this.positionOffset.set(x, y, z);
                return this;
            };

            Entity.prototype.load = function (data) {
                return;
            };

            Entity.prototype.scale = function (x, y, z) {
                if (!y && !z)
                    y = x;
                z = x;
                this.object.scale.set(x, y, z);
                return this;
            };

            Entity.prototype.position = function (x, y, z) {
                x = x + this.positionOffset.x;
                y = y + this.positionOffset.y;
                z = z + this.positionOffset.z;
                this.object.position.set(x, y, z);
                return this;
            };

            Entity.prototype.rotate = function (x, y, z) {
                this.object.rotation.set(x, y, z);
                return this;
            };

            Entity.prototype.getInternal = function () {
                return this.object;
            };

            Entity.prototype.frame = function (delta) {
                this.velocity.x += (-this.velocity.x) * 0.08 * delta;
                this.velocity.z += (-this.velocity.z) * 0.08 * delta;
                this.velocity.y -= 0.25 * delta;

                this.object.translateX(delta * this.velocity.x);
                this.object.translateX(-delta * this.velocity.x);
                this.object.translateZ(delta * this.velocity.z);
                this.object.translateZ(-delta * this.velocity.z);

                if (this.abilities.length > 0) {
                    this.abilities.forEach(function (ability) {
                        ability.frame(delta);
                    });
                }
            };
            return Entity;
        })(HG.Core.EventDispatcher);
        Entities.Entity = Entity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Abilities) {
        var Ability = (function (_super) {
            __extends(Ability, _super);
            function Ability() {
                _super.apply(this, arguments);
                this.hosts = [];
            }
            Ability.prototype.setHost = function (entity) {
                console.log(entity["constructor"]["name"] + " got " + this["constructor"]["name"]);
                this.hosts.push(entity);
            };

            Ability.prototype.checkCompatibility = function (entity) {
                return true;
            };

            Ability.prototype.frame = function (delta) {
                return;
            };
            return Ability;
        })(HG.Core.EventDispatcher);
        Abilities.Ability = Ability;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Scenes) {
        var Scene = (function () {
            function Scene() {
                this.startTime = Date.now();
                this.controls = new HG.Core.InputHandler();
                this.selectedCamera = "";
                this.scene = new Physijs.Scene();
                this.entities = new HG.Scenes.EntityCollection();
                this.cameras = new HG.Scenes.EntityCollection();
            }
            Scene.prototype.add = function (entity) {
                this.scene.add(entity.getInternal());
                if (entity instanceof HG.Entities.CameraEntity) {
                    this.cameras.add(entity);
                } else if (entity instanceof HG.Entities.Entity) {
                    this.entities.add(entity);
                }
            };

            Scene.prototype.merge = function (otherScene) {
                var newScene = new HG.Scenes.Scene();
                newScene.entities = this.entities.merge(otherScene.entities);
                newScene.cameras = this.cameras.merge(otherScene.cameras);
                newScene.controls = this.controls.merge(otherScene.controls);
                newScene.color = this.color;
                newScene.colorAlpha = this.colorAlpha;
                newScene.selectedCamera = this.selectedCamera;
                return newScene;
            };

            Scene.prototype.onResize = function (ratio) {
                this.cameras.forNamed(function (e) {
                    return e.resize(ratio);
                });
            };

            Scene.prototype.camera = function (name) {
                var has = this.cameras.has(name);
                if (has !== null) {
                    this.selectedCamera = name;
                    return true;
                } else {
                    return false;
                }
            };

            Scene.prototype.getInternal = function () {
                return this.scene;
            };

            Scene.prototype.getCamera = function () {
                return this.cameras.get(this.selectedCamera).getInternal() || null;
            };

            Scene.prototype.frame = function (delta) {
                var _this = this;
                this.controls.frame(delta);
                this.entities.forNamed(function (e) {
                    return e.frame(delta);
                });
                this.entities.forEach(function (e) {
                    if (e.object.material && e.object.material.uniforms && e.object.material.uniforms["time"]) {
                        var now = Date.now();
                        e.object.material.uniforms["time"].value = .00025 * (now - _this.startTime);
                    }
                });
                this.cameras.forNamed(function (e) {
                    return e.frame(delta);
                });
            };
            return Scene;
        })();
        Scenes.Scene = Scene;
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
                for (var member in provider) {
                    if (member !== "_prototype") {
                        registerFunction(member, prototype, provider[member]);
                    }
                }
            }
        }

        HG._gl = HG.Utils.hasGL();

        if (typeof window !== "undefined") {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
        }
        return HG;
    }
    HG.horrible = horrible;
})(HG || (HG = {}));

var query;
if (typeof document !== "undefined") {
    query = function (selector) {
        return document.querySelector.call(document, selector);
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
            function AnimationAbility(options) {
                _super.call(this);
                this.animOffset = 0;
                this.running = false;
                this.duration = 1000;
                this.keyframes = 20;
                this.interpolation = this.duration / this.keyframes;
                this.lastKeyframe = 0;
                this.currentKeyframe = 0;
                this.events = ["loaded"];
                this.animOffset = 0 || options.offset;
                this.duration = 1000 || options.duration;
                this.keyframes = 20 || options.keyframes;
            }
            AnimationAbility.prototype.run = function () {
                this.running = true;
            };

            AnimationAbility.prototype.checkCompatibility = function (entity) {
                return (entity instanceof HG.Entities.MeshEntity);
            };

            AnimationAbility.prototype.frame = function (delta) {
                var _this = this;
                _super.prototype.frame.call(this, delta);
                if (this.running === true) {
                    this.hosts.forEach(function (host) {
                        var time = new Date().getTime() % _this.duration;
                        var keyframe = Math.floor(time / _this.interpolation) + _this.animOffset;
                        if (keyframe !== _this.currentKeyframe) {
                            host.object["morphTargetInfluences"][_this.lastKeyframe] = 0;
                            host.object["morphTargetInfluences"][_this.currentKeyframe] = 1;
                            host.object["morphTargetInfluences"][keyframe] = 0;
                            _this.lastKeyframe = _this.currentKeyframe;
                            _this.currentKeyframe = keyframe;
                        }
                        host.object["morphTargetInfluences"][keyframe] = (time % _this.interpolation) / _this.interpolation;
                        host.object["morphTargetInfluences"][_this.lastKeyframe] = 1 - host.object["morphTargetInfluences"][keyframe];
                    });
                    this.running = false;
                }
            };
            return AnimationAbility;
        })(HG.Abilities.Ability);
        Abilities.AnimationAbility = AnimationAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Abilities) {
        var AudioAbility = (function (_super) {
            __extends(AudioAbility, _super);
            function AudioAbility(options) {
                _super.call(this);
                this.audioEffect = options.effect;
                if (this.audioEffect === null) {
                    HG.locale.errors.nullReferenceError.error();
                }
            }
            AudioAbility.prototype.play = function () {
                this.audioEffect.play();
            };
            return AudioAbility;
        })(HG.Abilities.Ability);
        Abilities.AudioAbility = AudioAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Abilities) {
        var MovingAbility = (function (_super) {
            __extends(MovingAbility, _super);
            function MovingAbility(baseStep) {
                _super.call(this);
                this.baseStep = baseStep;
            }
            MovingAbility.prototype.moveLeft = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.velocity.x -= 0.12 * delta * _this.baseStep;
                });
            };

            MovingAbility.prototype.moveRight = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.velocity.x += 0.12 * delta * _this.baseStep;
                });
            };

            MovingAbility.prototype.lower = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.object.position.y -= (delta * _this.baseStep);
                });
            };

            MovingAbility.prototype.turnLeft = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), (delta * _this.baseStep).toRadian());
                });
            };

            MovingAbility.prototype.turnRight = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), (-delta * _this.baseStep).toRadian());
                });
            };

            MovingAbility.prototype.moveForward = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.velocity.z -= 0.12 * delta * _this.baseStep;
                });
            };

            MovingAbility.prototype.moveBackward = function (delta) {
                var _this = this;
                this.hosts.forEach(function (host) {
                    host.velocity.z += 0.12 * delta * _this.baseStep;
                });
            };
            return MovingAbility;
        })(HG.Abilities.Ability);
        Abilities.MovingAbility = MovingAbility;
    })(HG.Abilities || (HG.Abilities = {}));
    var Abilities = HG.Abilities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Abilities) {
        var ScriptExecuteAbility = (function (_super) {
            __extends(ScriptExecuteAbility, _super);
            function ScriptExecuteAbility() {
                _super.call(this);
                this.events = ["loaded"];
            }
            ScriptExecuteAbility.prototype.checkCompatibility = function (entity) {
                return (entity instanceof HG.Entities.MeshEntity);
            };

            ScriptExecuteAbility.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
            };
            return ScriptExecuteAbility;
        })(HG.Abilities.Ability);
        Abilities.ScriptExecuteAbility = ScriptExecuteAbility;
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
                this.startTime = Date.now();
                this._running = false;
                this.events = [
                    "load", "connected", "start", "keyup", "keydown",
                    "resize", "render", "mouseDown", "mouseUp",
                    "mouseMove", "preRender", "postRender"];
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
            Object.defineProperty(BaseGame.prototype, "title", {
                set: function (v) {
                    document.title = v.join("");
                },
                enumerable: true,
                configurable: true
            });

            BaseGame.prototype.scene = function (scene) {
                this.pluginHost.dispatch("sceneChange", scene);
                this.renderer.setClearColor(scene.color, scene.colorAlpha);
                this.currentScene = scene;
            };

            BaseGame.prototype.screenshot = function (path, imageType) {
                if (typeof imageType === "undefined") { imageType = "image/png"; }
                var data = this.renderer.domElement.toDataURL(imageType);

                var raw = new Buffer(data.replace("data:" + imageType + ";base64,", ""), "base64");
                HG.Modules.fs.writeFile(path, raw);
            };

            BaseGame.prototype.load = function () {
                this.dispatch("load");
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
                global.require.cache = {};
                var whwnd = HG.Modules.ui.Window.get();
                whwnd.reloadIgnoringCache();
            };

            BaseGame.prototype.toggleFullScreenMode = function () {
                var whwnd = HG.Modules.ui.Window.get();
                whwnd.toggleFullscreen();
            };

            BaseGame.prototype.start = function (params) {
                var _this = this;
                this.dispatch("start");
                this._running = true;
                if (params.noResize === true) {
                    this.setFullScreenMode(HG.settings.graphics.fullscreen);
                    this.resize(HG.settings.graphics.resolution);
                }
                if (params.profileFrame === true) {
                    HG.Utils.profile("HG Profiling Frame", function () {
                        return _this.render.apply(_this);
                    });
                }
                window.onresize = function () {
                    return _this.onResize.apply(_this);
                };
                if (params.input === true) {
                    window.onkeydown = function (a) {
                        return _this.onKeyDown.apply(_this, [a]);
                    };
                    window.onkeyup = function (a) {
                        return _this.onKeyUp.apply(_this, [a]);
                    };
                    window.onmousemove = function (a) {
                        return _this.onMouseMove.apply(_this, [a]);
                    };
                    window.onmousedown = function (a) {
                        return _this.onMouseDown.apply(_this, [a]);
                    };
                    window.onmouseup = function (a) {
                        return _this.onMouseUp.apply(_this, [a]);
                    };
                }
                var render;
                if (HG.settings.graphics.useStaticFramerate === true) {
                    render = function () {
                        _this.render.apply(_this);
                    };
                    setInterval(render, 1000 / HG.settings.graphics.staticFramerate);
                } else {
                    render = function () {
                        _this.render.apply(_this);
                        requestAnimationFrame(render);
                    };
                }
                render();
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
                this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
                this.currentScene.onResize(window.innerWidth / window.innerHeight);
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            };

            BaseGame.prototype.render = function () {
                var delta = this.fpsCounter.frameTime / 10;
                this.dispatch("preRender", delta);
                this.currentScene.frame(delta);
                this.controls.frame(delta);
                this.fpsCounter.frame(delta);
                this.currentScene.getInternal().simulate();
                this.dispatch("render", delta);
                this.renderer.render(this.currentScene.getInternal(), this.currentScene.getCamera());
                this.dispatch("postRender", delta);
                console.timeStamp("rendered");
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
        var InputHandler = (function () {
            function InputHandler() {
                this.keyState = [];
                this.mouseState = [];
                this.mouse = new HG.Core.EventDispatcher(["x", "y", "move"]);
                this.keyboard = new HG.Core.EventDispatcher();
                this._mouse = new THREE.Vector2();
                for (var k in HG.Utils.KEY_MAP) {
                    this.keyboard.events.push(HG.Utils.KEY_MAP[k].toString());
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

            InputHandler.prototype.merge = function (otherHandler) {
                var newHandler = new HG.Core.InputHandler();
                newHandler.keyboard = this.keyboard.merge(otherHandler.keyboard);
                newHandler.mouse = this.mouse.merge(otherHandler.mouse);
                return newHandler;
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
        var Shader = (function () {
            function Shader() {
                this.vertex = "";
                this.fragment = "";
            }
            return Shader;
        })();
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

            CameraEntity.prototype.getInternal = function () {
                return this.object;
            };
            return CameraEntity;
        })(HG.Entities.Entity);
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
                if (target === null) {
                    HG.locale.errors.nullReferenceError.error();
                }
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

            FirstPersonCameraEntity.prototype.setViewDistance = function (distance) {
                this.object.far = distance;
                this.object.updateProjectionMatrix();
            };

            FirstPersonCameraEntity.prototype.frame = function (delta) {
                this.velocity.x += (-this.velocity.x) * 0.08 * delta;
                this.velocity.z += (-this.velocity.z) * 0.08 * delta;
                this.velocity.y -= 0.25 * delta;

                if (this.isOnObject === true) {
                    this.velocity.y = Math.max(0, this.velocity.y);
                }

                this.yawObject.translateX(this.velocity.x);
                this.yawObject.translateY(this.velocity.y);
                this.yawObject.translateZ(this.velocity.z);

                if (this.yawObject.position.y < 10) {
                    this.velocity.y = 0;
                    this.yawObject.position.y = 10;

                    this.canJump = true;
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
        })(HG.Entities.Entity);
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
        })(HG.Entities.Entity);
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
        })(HG.Entities.Entity);
        Entities.ParticleEntity = ParticleEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var SkyBoxEntity = (function (_super) {
            __extends(SkyBoxEntity, _super);
            function SkyBoxEntity(textures, order, size) {
                if (typeof order === "undefined") { order = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]; }
                if (typeof size === "undefined") { size = 5000; }
                _super.call(this);
                var skyGeometry = new THREE.CubeGeometry(size, size, size);

                var materialArray = [];
                order.forEach(function (d, i) {
                    materialArray.push(new THREE.MeshBasicMaterial({
                        map: textures[i],
                        side: THREE.BackSide
                    }));
                });
                var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
                this.object = new THREE.Mesh(skyGeometry, skyMaterial);
            }
            return SkyBoxEntity;
        })(HG.Entities.Entity);
        Entities.SkyBoxEntity = SkyBoxEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var SpriteEntity = (function (_super) {
            __extends(SpriteEntity, _super);
            function SpriteEntity(canvas, alignment) {
                if (typeof alignment === "undefined") { alignment = new THREE.Vector2(1, -1); }
                _super.call(this);
                this.alignment = alignment;
                if (typeof canvas !== "undefined") {
                    console.log("wat");
                    var texture = new THREE.Texture(canvas);
                    texture.needsUpdate = true;

                    var spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                        useScreenCoordinates: false,
                        alignment: this.alignment
                    });
                    this.object = new THREE.Sprite(spriteMaterial);
                }
            }
            SpriteEntity.prototype.load = function (texture) {
                var spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    useScreenCoordinates: false,
                    alignment: this.alignment
                });
                this.object = new THREE.Sprite(spriteMaterial);
            };
            return SpriteEntity;
        })(HG.Entities.Entity);
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
        })(HG.Entities.Entity);
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
        var FunctionProvider = (function () {
            function FunctionProvider() {
                this._prototype = Function.prototype;
            }
            return FunctionProvider;
        })();
        LINQ.FunctionProvider = FunctionProvider;
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
        var Cache = (function () {
            function Cache(loader) {
                this.loader = loader;
            }
            Cache.prototype.cache = function (path, data) {
                return true;
            };
            return Cache;
        })();
        Resource.Cache = Cache;
    })(HG.Resource || (HG.Resource = {}));
    var Resource = HG.Resource;
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
                var settings = "settings.json";
                HG.settings = this.json(settings);
                HG.locale = this.json(HG.settings.hgLocale);
            }
            ResourceLoader.prototype.path = function (path, silent) {
                var absPath = HG.Modules.path.join(this.baseDirectory, path);
                if (HG.Modules.fs.existsSync(absPath) === true) {
                    return absPath;
                } else {
                    if (silent || silent === false) {
                        HG.locale.errors.fileNotExisting.f(path).error();
                    }
                    return "";
                }
            };

            ResourceLoader.prototype.load = function (relPath, namespace, target) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 3); _i++) {
                    args[_i] = arguments[_i + 3];
                }
                var absPath = this.path(relPath);
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
                        var a = [absPath].concat(args);
                        loader.load.apply(loader, a);
                        foundLoader = true;
                    }
                }
                if (foundLoader === false) {
                    HG.locale.resource.noLoader.f(extension).error();
                }
            };

            ResourceLoader.prototype.model = function (path, entitiy) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 2); _i++) {
                    args[_i] = arguments[_i + 2];
                }
                this.load(path, HG.Resource.Model, entitiy, args);
            };

            ResourceLoader.prototype.sound = function (path, effect) {
                this.load(path, HG.Resource.Sound, effect);
            };

            ResourceLoader.prototype.texture = function (path) {
                var tex = THREE.ImageUtils.loadTexture(this.path(path));
                tex.anisotropy = HG.settings.graphics.aa;
                return tex;
            };

            ResourceLoader.prototype.queueTexture = function (paths, done) {
                var _this = this;
                var queue = [];
                paths.forEach(function (path) {
                    queue.push(function (next) {
                        next(_this.texture(path));
                    });
                });
                HG.Utils.queue(queue, done);
            };

            ResourceLoader.prototype.scene = function (path, done) {
                var serializer = new HG.Scenes.Serializer.SceneSerializer(this);
                serializer.on("done", done);
                serializer.fromGeneric(this.json(path));
            };

            ResourceLoader.prototype.queueScene = function (paths, done) {
                var _this = this;
                var queue = [];
                paths.forEach(function (path) {
                    queue.push(function (next) {
                        _this.scene(path, function (scene) {
                            next(scene);
                        });
                    });
                });
                HG.Utils.queue(queue, done);
            };

            ResourceLoader.prototype.queueJSON = function (paths, done) {
                var _this = this;
                var queue = [];
                paths.forEach(function (path, index) {
                    queue.push(function (next) {
                        next(_this.json(path));
                    });
                });
                HG.Utils.queue(queue, done);
            };

            ResourceLoader.prototype.shader = function (path) {
                var raw = this.json(path);
                var extend = function (d) {
                    for (var k in d) {
                        raw[k] = d[k];
                    }
                    return raw;
                };
                return {
                    vertex: raw.vertex,
                    fragment: raw.fragment,
                    extend: extend
                };
            };

            ResourceLoader.prototype.json = function (path, data) {
                path = this.path(path);
                if (data) {
                    HG.Modules.fs.writeFile(JSON.stringify(data), function (err) {
                        if (err)
                            throw err;
                    });
                    return null;
                } else if (HG.Modules.fs.existsSync(path) === true) {
                    var raw = HG.Modules.fs.readFileSync(path);
                    return JSON.parse(raw);
                } else {
                    return null;
                }
            };

            ResourceLoader.prototype.directory = function (directory, extension) {
                if (typeof extension === "undefined") { extension = ""; }
                var _this = this;
                var path = HG.Modules.path.join(this.baseDirectory, directory);
                var files = HG.Modules.fs.readdirSync(path);
                var realFiles = [];
                files.forEach(function (file) {
                    if (file.indexOf(extension) !== -1) {
                        realFiles.push(HG.Modules.path.join(_this.baseDirectory, directory, file));
                    }
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
    (function (Scenes) {
        var EntityCollection = (function () {
            function EntityCollection() {
                this.named = {};
                this.unNamed = [];
            }
            EntityCollection.prototype.add = function (entity) {
                if (entity.name) {
                    if (this.named[entity.name.toLowerCase()]) {
                        HG.locale.errors.duplicateNameTagError.f(entity.name).error();
                    } else {
                        this.named[entity.name.toLowerCase()] = entity;
                    }
                } else {
                    this.unNamed.push(entity);
                }
            };

            EntityCollection.prototype.merge = function (otherCollection) {
                var newCollection = new HG.Scenes.EntityCollection();
                newCollection.unNamed = this.unNamed.concat(otherCollection.unNamed);
                for (var k in this.named) {
                    newCollection.named[k] = this.named[k];
                }
                for (var k in otherCollection.named) {
                    newCollection.named[k] = otherCollection.named[k];
                }
                return newCollection;
            };

            EntityCollection.prototype.has = function (name) {
                if (!name)
                    return false;
                return (this.named[name.toLowerCase()]) ? true : false;
            };

            EntityCollection.prototype.getAllNamed = function (type) {
                if (typeof type === "undefined") { type = HG.Entities.Entity; }
                var es = [];
                for (var k in this.named) {
                    var v = this.named[k];
                    if (v instanceof type)
                        es.push(v);
                }
                return es;
            };

            EntityCollection.prototype.getAllUnnamed = function (type) {
                if (typeof type === "undefined") { type = HG.Entities.Entity; }
                var es = [];
                this.unNamed.forEach(function (e) {
                    if (e instanceof type)
                        es.push(e);
                });
                return es;
            };

            EntityCollection.prototype.getAll = function (type) {
                if (typeof type === "undefined") { type = HG.Entities.Entity; }
                return this.getAllUnnamed(type).concat(this.getAllNamed(type));
            };

            EntityCollection.prototype.forNamed = function (callback, type) {
                if (!type)
                    type = HG.Entities.Entity;
                for (var k in this.named) {
                    var ne = this.named[k];
                    if (ne instanceof type)
                        callback(ne, k);
                }
            };

            EntityCollection.prototype.forUnamed = function (callback, type) {
                if (!type)
                    type = HG.Entities.Entity;
                this.unNamed.forEach(function (e) {
                    if (e instanceof type)
                        callback(e);
                });
            };

            EntityCollection.prototype.forEach = function (callback) {
                this.unNamed.forEach(callback);
                for (var k in this.named) {
                    callback(this.named[k], k);
                }
            };

            EntityCollection.prototype.get = function (name) {
                name = name.toLowerCase();
                return this.named[name] || null;
            };

            EntityCollection.prototype.forAll = function (callback, type) {
                if (typeof type === "undefined") { type = HG.Entities.Entity; }
                this.forNamed(callback, type);
                this.forUnamed(callback, type);
            };
            return EntityCollection;
        })();
        Scenes.EntityCollection = EntityCollection;
    })(HG.Scenes || (HG.Scenes = {}));
    var Scenes = HG.Scenes;
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
        })(HG.Scenes.Scene);
        Scenes.GameScene = GameScene;
    })(HG.Scenes || (HG.Scenes = {}));
    var Scenes = HG.Scenes;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Scenes) {
        (function (Serializer) {
            var EntityParser = (function (_super) {
                __extends(EntityParser, _super);
                function EntityParser(scene, loader) {
                    _super.call(this, ["parsed", "entitiesParsed", "done"]);
                    this.defaultPosition = [0, 0, 0];
                    this.defaultRotation = [0, 0, 0];
                    this.defaultOffset = [0, 0, 0];
                    this.defaultScale = [1, 1, 1];
                    this.scene = scene;
                    this.loader = loader;
                }
                EntityParser.prototype.parseMaterials = function (raw, scene) {
                    var _this = this;
                    if (Array.isArray(raw) === true) {
                        var materials = [];
                        raw.forEach(function (m) {
                            materials.push(_this.parseSingleMaterial(m, scene));
                        });
                        return new THREE.MeshFaceMaterial(materials);
                    } else {
                        return this.parseSingleMaterial(raw, scene);
                    }
                };

                EntityParser.prototype.parseGeometry = function (raw, scene) {
                    var geometryType = THREE[raw.type];
                    var geometryProperties = this.parseProperties(raw.properties, scene);
                    var geometry = this.applyConstructor(geometryType, geometryProperties);
                    return geometry;
                };

                EntityParser.prototype.parseSingleMaterial = function (raw, scene) {
                    var material;
                    var materialType;
                    if (raw.properties[0]["color"]) {
                        raw.properties[0]["color"] = HG.Utils.parseColor(raw.properties[0]["color"]);
                    }
                    var properties = this.parseProperties(raw.properties, scene);
                    if (!raw.texture) {
                        materialType = THREE[raw.type];
                        material = new materialType(properties);
                    } else {
                        var map = THREE.ImageUtils.loadTexture(this.loader.path(raw.texture));
                        materialType = THREE[raw.type];
                        properties["map"] = map;
                        material = new materialType(properties);
                    }
                    return material;
                };

                EntityParser.prototype.parseShader = function (raw, scene) {
                    var rawShader = this.loader.json(raw.type);

                    return null;
                };

                EntityParser.prototype.parseAbilities = function (raw, entity, scene) {
                    var _this = this;
                    if (raw.abilities) {
                        raw.abilities.forEach(function (rawAbility) {
                            var type = HG.Abilities[rawAbility.type];

                            var properties = _this.parseProperties(rawAbility.properties, scene);
                            var keyboardBindings = rawAbility.bindings.keyboard || [];
                            var mouseBindings = rawAbility.bindings.mouse || [];

                            var ability = _this.applyConstructor(type, properties);

                            keyboardBindings.forEach(function (binding) {
                                var keyHandler = ability[binding.action];
                                scene.controls.keyboard.bind(HG.settings.keys[binding.event], function (delta, event) {
                                    keyHandler.apply(ability, [delta, event]);
                                });
                            });

                            mouseBindings.forEach(function (binding) {
                                var keyHandler = ability[binding.action];
                                scene.controls.mouse.bind(binding.event, function (delta, event) {
                                    keyHandler.apply(ability, [delta, event]);
                                });
                            });
                            entity.ability(ability);
                        });
                    }
                };

                EntityParser.prototype.setup = function (raw, entity) {
                    var offset = (raw.offset) ? this.parseArray(raw.offset, 3) : this.defaultOffset;
                    var scale = (raw.scale) ? this.parseArray(raw.scale, 3) : this.defaultScale;
                    var rotation = (raw.rotation) ? this.parseArray(raw.rotation, 3) : this.defaultRotation;
                    var position = (raw.position) ? this.parseArray(raw.position, 3) : this.defaultPosition;

                    entity.offset.apply(entity, offset);
                    entity.scale.apply(entity, scale);
                    entity.rotate.apply(entity, rotation);
                    entity.position.apply(entity, position);
                    return entity;
                };

                EntityParser.prototype.parseArray = function (raw, length) {
                    if (typeof length === "undefined") { length = 3; }
                    if (Array.isArray(raw) === true) {
                        if (raw.length < length) {
                            for (var i = raw.length; i < length; i++) {
                                raw.push(raw[0]);
                            }
                            return raw;
                        } else {
                            return raw;
                        }
                    } else if (typeof raw === "number") {
                        var nmbs = [];
                        for (var d = 0; d < length; d++) {
                            nmbs.push(raw);
                        }
                        return nmbs;
                    }
                };

                EntityParser.prototype.applyConstructor = function (type, argArray) {
                    var args = [null].concat(argArray);
                    var instance = type.bind.apply(type, args);
                    return new instance();
                };

                EntityParser.prototype.parseProperties = function (raw, scene) {
                    var _this = this;
                    var props = [];
                    raw.forEach(function (prop) {
                        props.push(_this.parseProperty(prop, scene));
                    });
                    return props;
                };

                EntityParser.prototype.parseProperty = function (raw, scene) {
                    if (typeof raw === "string") {
                        if (raw.substring(0, 8) === "${scene:") {
                            var entity = scene.entities.get(raw.replace("${scene:", "").replace("}", ""));
                            return entity;
                        } else {
                            return raw.f({
                                ratio: window.innerWidth / window.innerHeight,
                                viewDistance: HG.settings.graphics.viewDistance,
                                fov: HG.settings.graphics.fov
                            });
                        }
                    } else {
                        return raw;
                    }
                };

                EntityParser.prototype.parse = function (rawEntity) {
                    var _this = this;
                    var type = HG.Entities[rawEntity.type];
                    var entity;

                    if (rawEntity.model) {
                        entity = new type();
                        if (rawEntity.name)
                            entity.name = rawEntity.name;

                        entity.on("loaded", function (geometry, material) {
                            _this.setup(rawEntity, entity);
                            _this.parseAbilities(rawEntity, entity, _this.scene);
                            _this.dispatch("parsed", entity);
                        });
                        this.loader.model(rawEntity.model, entity);
                    } else if (rawEntity.model && rawEntity.material) {
                        entity = new type();
                        if (rawEntity.name)
                            entity.name = rawEntity.name;
                        var material = this.parseMaterials(rawEntity.material, this.scene);
                        entity.on("loaded", function (geometry, material) {
                            _this.setup(rawEntity, entity);
                            _this.parseAbilities(rawEntity, entity, _this.scene);
                            _this.dispatch("parsed", entity);
                        });
                        this.loader.model(rawEntity.model, entity, material);
                    } else if (rawEntity.material && rawEntity.geometry) {
                        entity = new type();
                        if (rawEntity.name)
                            entity.name = rawEntity.name;

                        var material = this.parseMaterials(rawEntity.material, this.scene);
                        var geometry = this.parseGeometry(rawEntity.geometry, this.scene);
                        var mesh = new THREE.Mesh(geometry, material);
                        entity.object = mesh;
                        this.setup(rawEntity, entity);
                        this.dispatch("parsed", entity);
                    } else if (rawEntity.shader && rawEntity.geometry) {
                        entity = new type();
                        if (rawEntity.name)
                            entity.name = rawEntity.name;

                        var geometry = this.parseGeometry(rawEntity.geometry, this.scene);
                        var material = this.parseShader(rawEntity.shader, this.scene);
                        var mesh = new THREE.Mesh(geometry, material);
                        entity.object = mesh;
                        this.setup(rawEntity, entity);
                        this.dispatch("parsed", entity);
                    } else if (rawEntity.object) {
                        entity = new type();
                        if (rawEntity.name)
                            entity.name = rawEntity.name;

                        var objectType = THREE[rawEntity.object.type];
                        var objectProperties = rawEntity.object.properties;
                        var object = this.applyConstructor(objectType, objectProperties);
                        entity.object = object;
                        this.setup(rawEntity, entity);
                        this.dispatch("parsed", entity);
                    } else if (rawEntity.type && rawEntity.properties) {
                        var properties = this.parseProperties(rawEntity.properties, this.scene);
                        entity = this.applyConstructor(type, properties);

                        if (rawEntity.name)
                            entity.name = rawEntity.name;
                        this.dispatch("parsed", entity);
                    }
                };
                return EntityParser;
            })(HG.Core.EventDispatcher);
            Serializer.EntityParser = EntityParser;
        })(Scenes.Serializer || (Scenes.Serializer = {}));
        var Serializer = Scenes.Serializer;
    })(HG.Scenes || (HG.Scenes = {}));
    var Scenes = HG.Scenes;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Scenes) {
        (function (Serializer) {
            var SceneSerializer = (function (_super) {
                __extends(SceneSerializer, _super);
                function SceneSerializer(loader) {
                    _super.call(this, ["done"]);
                    this.done = 0;
                    this.loader = loader;
                }
                SceneSerializer.prototype.fromGeneric = function (generic) {
                    var _this = this;
                    generic = generic;
                    var scene = new HG.Scenes.Scene();
                    scene.color = HG.Utils.parseColor(generic.color);
                    scene.colorAlpha = 1 || generic.colorAlpha;
                    var allEntities = generic.entities.concat(generic.cameras);
                    var index = 0;
                    var nextEntity = function (entry, scene) {
                        var parser = new HG.Scenes.Serializer.EntityParser(scene, _this.loader);
                        parser.on("parsed", function (entity) {
                            scene.add(entity);
                            index++;
                            if (index < allEntities.length) {
                                nextEntity(allEntities[index], scene);
                            } else {
                                scene.camera(generic.initialCamera);
                                _this.dispatch("done", scene);
                            }
                        });
                        parser.parse(entry);
                    };
                    nextEntity(allEntities[index], scene);
                };
                return SceneSerializer;
            })(HG.Core.EventDispatcher);
            Serializer.SceneSerializer = SceneSerializer;
        })(Scenes.Serializer || (Scenes.Serializer = {}));
        var Serializer = Scenes.Serializer;
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
                this.children = [];
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
        var Effect = (function (_super) {
            __extends(Effect, _super);
            function Effect(ch) {
                _super.call(this, ["playing", "stopped", "done"]);
                this.destination = ch;
                this.rootContext = this.destination.rootContext;
                this.gainNode = this.rootContext.createGain();
                this.gainNode.connect(this.rootContext.destination);
            }
            Effect.prototype.load = function (data) {
                this.source = this.rootContext.createBufferSource();
                this.buffer = data;
                this.source.buffer = data;
                this.source.connect(this.gainNode);
            };

            Effect.prototype.play = function () {
                this.source = this.rootContext.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.connect(this.gainNode);
                this.source.start(0);
                this.dispatch("playing");
            };

            Effect.prototype.stop = function () {
                this.source.stop(0);
                this.dispatch("stopped");
            };

            Effect.prototype.volume = function (gain) {
                this.gainNode.gain.value = gain;
            };
            return Effect;
        })(HG.Core.EventDispatcher);
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
//# sourceMappingURL=hg.js.map
