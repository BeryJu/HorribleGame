var HG;
(function (HG) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.events = {};
            this.eventsAvailable = [];
        }
        EventDispatcher.prototype.on = function (name, callback) {
            if (Array.isArray(name) === true) {
                for (var i = 0; i < name.length; i++) {
                    this.on(name[i], callback);
                }
            } else {
                if (typeof name !== "number") {
                    name = name.toString().toLowerCase();
                }
                if (this.eventsAvailable.indexOf(name) === -1) {
                    console.warn("Event '" + name + "' not available, still added though");
                } else {
                    console.log('Added EventHandler for \'' + name + '\'');
                }
                if (!this.events[name])
                    this.events[name] = [];
                this.events[name].push(callback);
            }
        };

        EventDispatcher.prototype.get = function (name) {
            if (Array.isArray(name) === true) {
                var events = {};
                for (var i = 0; i < name.length; i++) {
                    events[name[i]] = this.get(name[i]);
                }
                return events;
            } else {
                if (typeof name !== "number") {
                    name = name.toString().toLowerCase();
                }
                var events = {};
                events[name] = this.events[name];
                return events;
            }
        };

        EventDispatcher.prototype.clear = function (name) {
            if (typeof name !== "number") {
                name = name.toString().toLowerCase();
            }
            if (!this.events[name])
                return;
            if (this.events[name].length === 0)
                return;
            this.events[name] = [];
        };

        EventDispatcher.prototype.dispatch = function (name, args) {
            if (typeof args === "undefined") { args = {}; }
            if (Array.isArray(name) === true) {
                for (var i = 0; i < name.length; i++) {
                    this.dispatch(name[i], args);
                }
            } else {
                if (typeof name !== "number") {
                    name = name.toString().toLowerCase();
                }
                if (!(name in this.eventsAvailable)) {
                    this.eventsAvailable.push(name);
                }
                if (!this.events[name])
                    return;
                if (this.events[name].length === 0)
                    return;
                if (!args['callee'])
                    args['callee'] = name;
                this.events[name].forEach(function (event) {
                    event(args);
                });
            }
        };
        return EventDispatcher;
    })();
    HG.EventDispatcher = EventDispatcher;
})(HG || (HG = {}));
///<reference path="EventDispatcher" />
/*
* BaseGame.ts
* Author: BeryJu
*/
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
        function BaseGame(container, clearColor) {
            if (typeof container === "undefined") { container = document.body; }
            if (typeof clearColor === "undefined") { clearColor = new THREE.Color(0x000000); }
            _super.call(this);
            this._ = {};
            this.isRunning = false;
            this.scene = new HG.Scene();
            this.controls = new HG.InputHandler();
            this.fpsCounter = new HG.FPSCounter();
            this.eventsAvailable = [
                "preload",
                "connected",
                "start",
                "keyup",
                "keydown",
                "resize",
                "render"
            ];
            if (HG.Utils.hasGL() === false) {
                throw new Error("Your Browser doesn't support WebGL");
            }
            this.camera = new THREE.PerspectiveCamera(HG.Settings.fov, window.innerWidth / window.innerHeight, 0.1, HG.Settings.viewDistance);
            this.renderer = new THREE.WebGLRenderer({ antialias: HG.Settings.antialiasing });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(clearColor, 1);
            container.appendChild(this.renderer.domElement);
        }
        BaseGame.prototype.preLoad = function () {
            console.log('loading assets');
            this.dispatch('preload');
            console.log('loaded assets');
        };

        BaseGame.prototype.connect = function (serverHost) {
            var io = require('socket.io-client');
            if (this.socketClient !== undefined) {
                // this.socketClient.disconnect();
            }
            this.socketClient = io.connect(serverHost);
            this.socketClient.on('news', function (data) {
                console.log(data);
            });
            this.dispatch("connected", { host: serverHost });
        };

        BaseGame.prototype.start = function (serverHost) {
            this.connect(serverHost);
            this.dispatch('start');
            this.isRunning = true;
        };

        BaseGame.prototype.onKeyUp = function (a) {
            this.controls.onKeyUp(a);
            this.dispatch('keyUp', { event: a });
        };

        BaseGame.prototype.onKeyDown = function (a) {
            this.controls.onKeyDown(a);
            this.dispatch('keyDown', { event: a });
        };

        BaseGame.prototype.onResize = function () {
            this.dispatch('resize');
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        BaseGame.prototype.render = function () {
            var delta = this.fpsCounter.getFrameTime() / 10;
            this.dispatch('render', { delta: delta });
            this.controls.frame(delta);
            this.fpsCounter.frame(delta);
            this.renderer.render(this.scene.scene, this.camera);
        };
        return BaseGame;
    })(HG.EventDispatcher);
    HG.BaseGame = BaseGame;
})(HG || (HG = {}));
///<reference path="EventDispatcher" />
var HG;
(function (HG) {
    var BaseServer = (function (_super) {
        __extends(BaseServer, _super);
        function BaseServer(port) {
            _super.call(this);
            var io = require('socket.io');
            this.socketServer = io.listen(port);
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
var HG;
(function (HG) {
    var GameComponent = (function (_super) {
        __extends(GameComponent, _super);
        function GameComponent() {
            _super.call(this);
        }
        GameComponent.prototype.frame = function (delta) {
        };
        return GameComponent;
    })(HG.EventDispatcher);
    HG.GameComponent = GameComponent;
})(HG || (HG = {}));
///<reference path="GameComponent" />
var HG;
(function (HG) {
    var BaseEntity = (function (_super) {
        __extends(BaseEntity, _super);
        function BaseEntity(object) {
            _super.call(this);
            this.positionOffset = new THREE.Vector3();
            if (object) {
                this.object = object;
            } else {
                this.object = new THREE.Mesh();
            }
        }
        BaseEntity.prototype.offset = function (x, y, z) {
            this.positionOffset.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.position = function (x, y, z) {
            x = x + this.positionOffset.x;
            y = y + this.positionOffset.y;
            z = z + this.positionOffset.z;
            this.object.position.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.rotation = function (x, y, z) {
            this.object.rotation.set(x, y, z);
            return this;
        };

        BaseEntity.prototype.set = function (key, value) {
            if (key.indexOf(".") === -1) {
                this.object[key] = value;
            } else {
                var parts = key.split(".");
                var obj = this.object;
                for (var i = 0; i < parts.length - 1; i++) {
                    obj = obj[parts[i]];
                }
                obj[parts[length]] = value;
            }
            return this;
        };

        BaseEntity.prototype.get = function (key) {
            if (key.indexOf(".") === -1) {
                return this.object[key];
            } else {
                var parts = key.split(".");
                var obj = this.object;
                for (var i = 0; i < parts.length - 1; i++) {
                    obj = obj[parts[i]];
                }
                return obj[parts[length]];
            }
        };
        return BaseEntity;
    })(HG.GameComponent);
    HG.BaseEntity = BaseEntity;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var InputHandler = (function (_super) {
        __extends(InputHandler, _super);
        function InputHandler() {
            _super.call(this);
            this.keyState = [];
            this.bind = this.on;
            for (var k in HG.KeyMap) {
                this.eventsAvailable.push(HG.KeyMap[k]);
            }
        }
        InputHandler.prototype.onKeyDown = function (e) {
            this.keyState[e.keyCode] = 1;
        };

        InputHandler.prototype.onKeyUp = function (e) {
            this.keyState[e.keyCode] = 0;
        };

        InputHandler.prototype.frame = function (delta) {
            for (var i = 0; i < this.keyState.length; i++) {
                if (this.keyState[i] === 1) {
                    this.dispatch(i, { delta: delta });
                }
            }
        };
        return InputHandler;
    })(HG.GameComponent);
    HG.InputHandler = InputHandler;
})(HG || (HG = {}));
var HG;
(function (HG) {
    HG.KeyMap = {
        D: 68,
        A: 65,
        S: 83,
        W: 87,
        Q: 81,
        E: 69,
        Left: 37,
        Right: 39,
        Top: 38,
        Bottom: 40,
        Space: 32,
        Esc: 27,
        F11: 122,
        F12: 123
    };
})(HG || (HG = {}));
var HG;
(function (HG) {
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
    HG.Noise = Noise;
})(HG || (HG = {}));
/// <reference path="utils/Noise.hg.ts" />
var HG;
(function (HG) {
    HG.SIZE_X = 64;
    HG.SIZE_Y = HG.SIZE_X / 4;
    HG.BLOCK_SIZE = 50;

    var LevelStructure = (function (_super) {
        __extends(LevelStructure, _super);
        function LevelStructure() {
            _super.call(this);
            this.entities = new HG.Map();
            this.camera = {
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 }
            };
            this.eventsAvailable = ["loaded", "created"];
        }
        LevelStructure.prototype.load = function (JSONString) {
            var r = JSON.parse(JSONString);
            this.entities = new HG.Map();
            for (var i = 0; i < HG.SIZE_X * HG.BLOCK_SIZE; i += HG.BLOCK_SIZE) {
                for (var j = 0; j < HG.SIZE_Y * HG.BLOCK_SIZE; j += HG.BLOCK_SIZE) {
                    var e = r.entities['data'][i][j][0];
                    this.entities.set(e, i, j);
                }
            }
            this.camera = r.camera;
            this.dispatch('loaded', { level: this });
        };

        LevelStructure.prototype.onReadyStateChange = function (req) {
            if (req.readyState === 4) {
                this.load(req.responseText);
            }
        };

        LevelStructure.prototype.loadAsync = function (url) {
            var req = new XMLHttpRequest();
            var t = this;
            req.onreadystatechange = function (req) {
                t.onReadyStateChange(this);
            };
            req.open("GET", url, true);
            req.send();
        };

        LevelStructure.prototype.create = function (Seed) {
            this.entities = new HG.Map();
            for (var i = 0; i < HG.SIZE_X * HG.BLOCK_SIZE; i += HG.BLOCK_SIZE) {
                for (var j = 0; j < HG.SIZE_Y * HG.BLOCK_SIZE; j += HG.BLOCK_SIZE) {
                    var noise = HG.Noise.Generate2(i, j);
                    var l = Math.floor((noise * 50) - 50);
                    var color = HG.Utils.rgbToHex(i / 10 + 50, j / 10 + 50, ((i + j) / 2) / 10 + 50);
                    var e = {
                        type: "solid",
                        indentation: l,
                        color: color
                    };
                    this.entities.set(e, i, j);
                }
            }
            this.camera.position = { x: -127, y: 290, z: 250 };
            this.camera.rotation = { x: 75, y: 75, z: 0 };
            this.dispatch('created', { level: this });
        };
        return LevelStructure;
    })(HG.EventDispatcher);
    HG.LevelStructure = LevelStructure;
})(HG || (HG = {}));
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
            for (var i = 0; i < HG.SIZE_X * HG.BLOCK_SIZE; i += HG.BLOCK_SIZE) {
                for (var j = 0; j < HG.SIZE_Y * HG.BLOCK_SIZE; j += HG.BLOCK_SIZE) {
                    var be = lvl.entities.get(i, j);
                    var re = new HG.BaseEntity(new THREE.Mesh(new THREE.CubeGeometry(HG.BLOCK_SIZE, HG.BLOCK_SIZE, HG.BLOCK_SIZE), new THREE.MeshPhongMaterial({ color: be.color })));
                    re.position(i, j, be.indentation);
                    this.entities.push(re);
                }
            }
            this.camera.position = new THREE.Vector3(lvl.camera.position.x, lvl.camera.position.y, lvl.camera.position.z);
            this.camera.rotation = new THREE.Vector3(lvl.camera.rotation.x, lvl.camera.rotation.y, lvl.camera.rotation.z);
        }
        Level.prototype.applyCamera = function (camera) {
            camera.position = this.camera.position;
            camera.rotation.x = this.camera.rotation.x;
            camera.rotation.y = this.camera.rotation.y;
            camera.rotation.z = this.camera.rotation.z;
        };
        return Level;
    })(HG.EventDispatcher);
    HG.Level = Level;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Scene = (function () {
        function Scene() {
            this.scene = null;
            this.scene = new THREE.Scene();
            this.entities = {
                named: {},
                unnamed: []
            };
        }
        Scene.prototype.add = function (BaseEntity, nameTag) {
            this.scene.add(BaseEntity.object);
            if (nameTag) {
                this.entities.named[nameTag.toLowerCase()] = BaseEntity;
            } else {
                this.entities.unnamed.push(BaseEntity);
            }
        };

        Scene.prototype.forAllNamed = function (callback, type) {
            if (!type)
                type = HG.BaseEntity;
            for (var k in this.entities.named) {
                var ne = this.entities.named[k];
                if (ne instanceof type)
                    callback(ne);
            }
        };

        Scene.prototype.getAllNamed = function (type) {
            if (typeof type === "undefined") { type = HG.BaseEntity; }
            var es = [];
            for (var k in this.entities.named) {
                var ne = this.entities.named[k];
                if (ne instanceof type)
                    es.push(ne);
            }
            return es;
        };

        Scene.prototype.getAllUnnamed = function (type) {
            if (typeof type === "undefined") { type = HG.BaseEntity; }
            var es = [];
            for (var i = 0; i < this.entities.unnamed.length; i++) {
                var ue = this.entities.unnamed[i];
                if (ue instanceof type)
                    es.push(ue);
            }
            return es;
        };

        Scene.prototype.getAll = function (type) {
            if (typeof type === "undefined") { type = HG.BaseEntity; }
            var es = [];
            for (var k in this.entities.named) {
                var ne = this.entities.named[k];
                if (ne instanceof type)
                    es.push(ne);
            }
            for (var i = 0; i < this.entities.unnamed.length; i++) {
                var ue = this.entities.unnamed[i];
                if (ue instanceof type)
                    es.push(ue);
            }
            return es;
        };

        Scene.prototype.get = function (nameTag, type) {
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
        return Scene;
    })();
    HG.Scene = Scene;
})(HG || (HG = {}));
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
var HG;
(function (HG) {
    (function (Entities) {
        var MovingEntity = (function (_super) {
            __extends(MovingEntity, _super);
            function MovingEntity() {
                _super.apply(this, arguments);
                this.jumpState = 0;
                //0: normal
                //1: rising
                //2: max
                //3: falling
                this.oldY = 0;
                this.maxY = 200;
            }
            MovingEntity.prototype.moveLeft = function (step) {
                if (typeof step === "undefined") { step = 3.125; }
                this.object.position.x -= step;
            };

            MovingEntity.prototype.moveRight = function (step) {
                if (typeof step === "undefined") { step = 3.125; }
                this.object.position.x += step;
            };

            MovingEntity.prototype.jump = function () {
                this.oldY = this.object.position.y;
                this.jumpState = 1;
            };

            MovingEntity.prototype.frame = function (delta) {
                if (this.jumpState >= 1) {
                    if (this.jumpState === 3) {
                        this.oldY = this.object.position.y;
                        this.jumpState = 0;
                    }
                    if (this.object.position.y < (this.maxY + this.oldY) && this.jumpState === 1) {
                        this.object.position.y += 3 * delta;
                    }
                    if (this.object.position.y >= (this.maxY + this.oldY) && this.jumpState >= 1) {
                        this.jumpState = 2;
                    }
                    if (this.object.position.y <= this.oldY && this.jumpState >= 2) {
                        this.object.position.y = this.oldY;
                        this.jumpState = 3;
                    } else if (this.jumpState >= 2) {
                        this.object.position.y -= 3 * delta;
                    }
                }
            };
            return MovingEntity;
        })(HG.BaseEntity);
        Entities.MovingEntity = MovingEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/// <reference path="MovingEntity.hg.ts" />
var HG;
(function (HG) {
    (function (Entities) {
        var AnimatedEntity = (function (_super) {
            __extends(AnimatedEntity, _super);
            function AnimatedEntity(url) {
                _super.call(this);
                this.animOffset = 0;
                this.running = false;
                this.duration = 1000;
                this.keyframes = 20;
                this.interpolation = this.duration / this.keyframes;
                this.lastKeyframe = 0;
                this.currentKeyframe = 0;
                this.eventsAvailable = ["loaded"];
                if (url)
                    this.loadAsync(url);
            }
            AnimatedEntity.prototype.onReadyStateChange = function (req) {
                if (req.readyState === 4) {
                    var loader = new THREE.JSONLoader();
                    var result = loader.parse(JSON.parse(req.responseText));
                    this.load(result.geometry, result.materials);
                }
            };

            AnimatedEntity.prototype.loadAsync = function (url) {
                var req = new XMLHttpRequest();
                var scope = this;
                req.onreadystatechange = function (req) {
                    scope.onReadyStateChange(this);
                };
                req.open("GET", url, true);
                req.send();
            };

            AnimatedEntity.prototype.load = function (geometry, materials) {
                for (var i = 0; i < materials.length; i++) {
                    materials[i]['morphTargets'] = true;
                }
                var material = new THREE.MeshFaceMaterial(materials);
                this.object = new THREE.Mesh(geometry, material);
                this.dispatch('loaded');
            };

            AnimatedEntity.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
                if (this.running === true) {
                    var time = new Date().getTime() % this.duration;
                    var keyframe = Math.floor(time / this.interpolation) + this.animOffset;
                    if (keyframe != this.currentKeyframe) {
                        this.object.morphTargetInfluences[this.lastKeyframe] = 0;
                        this.object.morphTargetInfluences[this.currentKeyframe] = 1;
                        this.object.morphTargetInfluences[keyframe] = 0;
                        this.lastKeyframe = this.currentKeyframe;
                        this.currentKeyframe = keyframe;
                    }
                    this.object.morphTargetInfluences[keyframe] = (time % this.interpolation) / this.interpolation;
                    this.object.morphTargetInfluences[this.lastKeyframe] = 1 - this.object.morphTargetInfluences[keyframe];
                    this.running = false;
                }
            };
            return AnimatedEntity;
        })(Entities.MovingEntity);
        Entities.AnimatedEntity = AnimatedEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/*
* AudioEntity.hg.ts
* Author: BeryJu
*/
var HG;
(function (HG) {
    (function (Entities) {
        var AudioEntity = (function (_super) {
            __extends(AudioEntity, _super);
            function AudioEntity(url) {
                _super.call(this);
                this.eventsAvailable = ["loaded"];
                if (url)
                    this.loadAsync(url);
            }
            AudioEntity.prototype.onReadyStateChange = function (req) {
                if (req.readyState === 4) {
                    var scope = this;
                    // context.decodeAudioData(req.response, function(buffer) {
                    // 	scope.load(buffer);
                    // });
                }
            };

            AudioEntity.prototype.loadAsync = function (url) {
                var req = new XMLHttpRequest();
                var scope = this;
                req.responseType = 'arraybuffer';
                req.onreadystatechange = function (req) {
                    scope.onReadyStateChange(this);
                };
                req.open("GET", url, true);
                req.send();
            };

            AudioEntity.prototype.load = function (buffer) {
                this.buffer = buffer;
                this.dispatch('loaded');
            };

            AudioEntity.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
            };
            return AudioEntity;
        })(HG.BaseEntity);
        Entities.AudioEntity = AudioEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
/// <reference path="MovingEntity.hg.ts" />
/*
* ModelEntity.hg.ts
* Author: BeryJu
*/
var HG;
(function (HG) {
    (function (Entities) {
        var ModelEntity = (function (_super) {
            __extends(ModelEntity, _super);
            function ModelEntity(url) {
                _super.call(this);
                this.eventsAvailable = ["loaded"];
                if (url)
                    this.loadAsync(url);
            }
            ModelEntity.prototype.onReadyStateChange = function (req) {
                if (req.readyState === 4) {
                    var loader = new THREE.JSONLoader();
                    var result = loader.parse(JSON.parse(req.responseText));
                    this.load(result.geometry, result.materials);
                }
            };

            ModelEntity.prototype.loadAsync = function (url) {
                var req = new XMLHttpRequest();
                var scope = this;
                req.onreadystatechange = function (req) {
                    scope.onReadyStateChange(this);
                };
                req.open("GET", url, true);
                req.send();
            };

            ModelEntity.prototype.load = function (geometry, materials) {
                var material = new THREE.MeshFaceMaterial(materials);
                this.object = new THREE.Mesh(geometry, material);
                this.dispatch('loaded');
            };

            ModelEntity.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
            };
            return ModelEntity;
        })(Entities.MovingEntity);
        Entities.ModelEntity = ModelEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
var HG;
(function (HG) {
    (function (Entities) {
        var TemplateEntity = (function (_super) {
            __extends(TemplateEntity, _super);
            function TemplateEntity() {
                _super.call(this);
            }
            TemplateEntity.prototype.frame = function (delta) {
                _super.prototype.frame.call(this, delta);
            };
            return TemplateEntity;
        })(HG.BaseEntity);
        Entities.TemplateEntity = TemplateEntity;
    })(HG.Entities || (HG.Entities = {}));
    var Entities = HG.Entities;
})(HG || (HG = {}));
///<reference path="../GameComponent" />
var HG;
(function (HG) {
    var ColorTransition = (function (_super) {
        __extends(ColorTransition, _super);
        function ColorTransition() {
            _super.call(this);
            this.isDone = false;
            this.baseColor = new THREE.Color();
            this.currentColor = new THREE.Color();
            this.currentFrame = 0;
            this.frameSpan = 0;
            this.currentTarget = 0;
            this.targets = [];
        }
        ColorTransition.prototype.getColor = function () {
            return this.currentColor;
        };

        ColorTransition.prototype.target = function (color) {
            this.targets.push(color);
            this.dispatch('targetAdded', color);
            return this;
        };

        ColorTransition.prototype.over = function (frames) {
            this.frameSpan = frames;
            return this;
        };

        ColorTransition.prototype.from = function (color) {
            this.baseColor = color;
            return this;
        };

        ColorTransition.prototype.frame = function (delta) {
            if (this.currentFrame >= this.frameSpan) {
                this.isDone = true;
                this.dispatch('done', this);
            } else {
                if (this.currentColor === this.targets[this.currentTarget]) {
                    this.currentTarget++;
                    this.currentFrame = 0;
                    if (this.currentTarget > this.targets.length) {
                        this.isDone = true;
                        this.dispatch('done', this);
                    }
                } else {
                    var target = this.targets[this.currentTarget];
                    var r = this.increment(this.currentColor.r, target.r, delta, this.frameSpan - this.currentTarget);
                    var g = this.increment(this.currentColor.g, target.g, delta, this.frameSpan - this.currentTarget);
                    var b = this.increment(this.currentColor.b, target.b, delta, this.frameSpan - this.currentTarget);

                    console.log(r);
                    console.log(g);
                    console.log(b);
                    this.currentColor.r += r;
                    this.currentColor.g += g;
                    this.currentColor.b += b;
                }
                this.currentFrame++;
            }
        };

        ColorTransition.prototype.increment = function (from, to, delta, framesLeft) {
            return ((to - from) / framesLeft);
        };
        return ColorTransition;
    })(HG.GameComponent);
    HG.ColorTransition = ColorTransition;
})(HG || (HG = {}));
/// <reference path="../GameComponent" />
var HG;
(function (HG) {
    var FPSCounter = (function (_super) {
        __extends(FPSCounter, _super);
        function FPSCounter() {
            _super.call(this);
            this.lastFrameTime = 0;
            this.lastSecond = 0;
            this.currentFrames = 0;
            this.highestFPS = 0;
            this.frameTime = 0;
            this.fps = 0;
            this.lastFrameTime = new Date().getTime();
        }
        FPSCounter.prototype.getFPS = function () {
            return this.fps;
        };

        FPSCounter.prototype.getMaxFPS = function () {
            return this.highestFPS;
        };

        FPSCounter.prototype.getFrameTime = function () {
            return this.frameTime;
        };

        FPSCounter.prototype.frame = function (delta) {
            var Now = new Date();
            var Diff = new Date(Now.getTime() - this.lastFrameTime);

            //FrameTime
            this.frameTime = Diff.getTime();
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
    })(HG.GameComponent);
    HG.FPSCounter = FPSCounter;
})(HG || (HG = {}));
var HG;
(function (HG) {
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
            if (!this.data[x][y][z])
                this.data[x][y][z] = {};
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
            if (typeof fallback === "undefined") { fallback = undefined; }
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
    HG.Map = Map;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Settings = (function () {
        function Settings() {
        }
        Settings.fov = 110;
        Settings.viewDistance = 500;
        Settings.shadowMapSize = 2048;
        Settings.antialiasing = true;
        Settings.keys = {
            left: [HG.KeyMap.A, HG.KeyMap.Left],
            right: [HG.KeyMap.D, HG.KeyMap.Right],
            pause: HG.KeyMap.Esc,
            jump: HG.KeyMap.Space,
            devConsole: HG.KeyMap.F12,
            fullscreen: HG.KeyMap.F11
        };
        return Settings;
    })();
    HG.Settings = Settings;
    ;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.rgbToHex = function (r, g, b) {
            var componentToHex = function (c) {
                c = Math.abs(Math.floor(c));
                if (c > 255)
                    c = 255;
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            };
            return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
        };

        Utils.degToRad = function (deg) {
            return deg * Math.PI / 180;
        };

        Utils.hasGL = function () {
            return (window.WebGLRenderingContext) ? true : false;
        };

        Utils.setFullScreenMode = function (state) {
            var whwnd = require('nw.gui').Window.get();
            if (state === true) {
                whwnd.enterFullscreen();
            } else {
                whwnd.leaveFullscreen();
            }
        };

        Utils.reload = function () {
            var whwnd = require('nw.gui').Window.get();
            whwnd.reloadIgnoringCache();
        };

        Utils.toggleFullScreenMode = function () {
            var whwnd = require('nw.gui').Window.get();
            whwnd.toggleFullscreen();
        };

        Utils.openDevConsole = function () {
            require('nw.gui').Window.get().showDevTools();
        };

        Utils.isNode = function () {
            return (process) ? true : false;
        };
        return Utils;
    })();
    HG.Utils = Utils;
})(HG || (HG = {}));
var game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));
var pkg = require("./package.json");
console.log("HorribleGame build " + pkg.build);
game.on('preload', function () {
    var color = 0xffffff;
    var playerLight = new HG.Entities.MovingEntity(new THREE.PointLight(color, 3, HG.Settings.viewDistance));
    playerLight.offset(0, 50, 0);
    game.scene.add(playerLight, "playerLight");
    var playerModel = new HG.Entities.AnimatedEntity();
    playerModel.on('loaded', function () {
        playerModel.object.scale.set(10, 10, 10);
        playerModel.object.rotation.y = HG.Utils.degToRad(90);
        game.scene.add(playerModel, "playerModel");
        game.scene.forAllNamed(function (e) {
            e.position(-37.5, 270, 0);
        });
    });
    playerModel.loadAsync("app://hg/assets/models/android.json");
    var levelStruct = new HG.LevelStructure();
    levelStruct.on('loaded', function (args) {
        var level = new HG.Level(args['level']);
        level.entities.forEach(function (e) {
            game.scene.add(e);
        });
        level.applyCamera(game.camera);
    });
    levelStruct.loadAsync("app://hg/assets/levels/level1.json");
});

// var levelStruct = new HG.LevelStructure();
// levelStruct.on('created', function(args: {}) {
// 	var level = new HG.Level(args['level']);
// 	level.entities.forEach(function(e) {
// 		game.scene.add(e);
// 	});
// 	level.applyCamera(game.camera);
// });
// levelStruct.create();
game.on('start', function () {
    document.getElementById('build').innerText = "HorribleGame build " + pkg.build;
    window.onresize = function () {
        game.onResize();
    };
    window.onkeydown = function (a) {
        game.onKeyDown(a);
    };
    window.onkeyup = function (a) {
        game.onKeyUp(a);
    };
    var r = function () {
        game.render();
        requestAnimationFrame(r);
    };
    r();
});

game.on('keydown', function (a) {
    if (a['event']['keyCode'] === HG.Settings.keys.devConsole) {
        HG.Utils.openDevConsole();
    }
});

game.controls.bind(HG.Settings.keys.fullscreen, function (args) {
    HG.Utils.toggleFullScreenMode();
});

game.controls.bind(HG.Settings.keys.left, function (args) {
    game.scene.forAllNamed(function (e) {
        if (e instanceof HG.Entities.MovingEntity)
            e.moveLeft(3.125 * args['delta']);
        if (e instanceof HG.Entities.AnimatedEntity)
            e.running = true;
    });
    game.camera.position.x -= 3.125 * args['delta'];
});

game.controls.bind(HG.Settings.keys.right, function (args) {
    game.scene.forAllNamed(function (e) {
        if (e instanceof HG.Entities.MovingEntity)
            e.moveRight(3.125 * args['delta']);
        if (e instanceof HG.Entities.AnimatedEntity)
            e.running = true;
    });
    game.camera.position.x += 3.125 * args['delta'];
});

game.controls.bind(HG.Settings.keys.jump, function (args) {
    game.scene.forAllNamed(function (e) {
        if (e instanceof HG.Entities.MovingEntity)
            e.jump();
        if (e instanceof HG.Entities.AnimatedEntity)
            e.running = true;
    });
});

game.on(['start', 'resize'], function () {
    document.getElementById("resolution").innerText = "Rendering on: " + window.innerWidth + "x" + window.innerHeight;
});

game.on("connected", function (args) {
    document.getElementById("server").innerText = "Connected to " + args['host'];
});

game.on("render", function (args) {
    game.scene.getAll().forEach(function (e) {
        e.frame(args['delta']);
    });
    document.getElementById("fps").innerText = "FPS: " + game.fpsCounter.getFPS();
    document.getElementById("hfps").innerText = "Highest FPS: " + game.fpsCounter.getMaxFPS();
    document.getElementById("frametime").innerText = "Frametime: " + game.fpsCounter.getFrameTime() + "ms";
});

window.onload = function () {
    game.preLoad();
};

var srv = new HG.BaseServer(9898);

if (game.isRunning === false) {
    game.start("http://localhost:9898");
}
