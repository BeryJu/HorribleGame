var HG;
(function (HG) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.events = {};
        }
        EventDispatcher.prototype.on = function (name, callback) {
            if (Array.isArray(name) === true) {
                for (var i = 0; i < name.length; ++i) {
                    this.on(name[i], callback);
                }
            } else {
                if (typeof name !== "number") {
                    name = name.toString().toLowerCase();
                }
                console.log('Added EventHandler for \'' + name + '\'');
                if (!this.events[name])
                    this.events[name] = [];
                this.events[name].push(callback);
            }
        };

        EventDispatcher.prototype.clear = function (name) {
            name = name.toLowerCase();
            if (!this.events[name])
                return;
            if (this.events[name].length === 0)
                return;
            this.events[name] = [];
        };

        EventDispatcher.prototype.dispatch = function (name) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (Array.isArray(name) === true) {
                for (var i = 0; i < name.length; ++i) {
                    this.dispatch(name[i], args);
                }
            } else {
                if (typeof name !== "number") {
                    name = name.toString().toLowerCase();
                }
                if (!this.events[name])
                    return;
                if (this.events[name].length === 0)
                    return;
                args.push(name);
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
            if (HG.Utils.hasGL() === false) {
                var up = new Error("Your Browser doesn't support WebGL");
                throw up;
            }
            this.camera = new THREE.PerspectiveCamera(HG.Settings.fov, window.innerWidth / window.innerHeight, 0.1, HG.Settings.viewDistance);
            this.renderer = new THREE.WebGLRenderer({ antialias: HG.Settings.antialiasing });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(clearColor, 1);
            container.appendChild(this.renderer.domElement);
        }
        BaseGame.prototype.preLoad = function () {
            console.log('loading assets');
            this.dispatch('PreLoad');
            console.log('loaded assets');
        };

        BaseGame.prototype.start = function () {
            this.dispatch('Start');
            this.isRunning = true;
        };

        BaseGame.prototype.onKeyUp = function (a) {
            this.controls.onKeyUp(a);
            this.dispatch('KeyUp', a);
        };

        BaseGame.prototype.onKeyDown = function (a) {
            this.controls.onKeyDown(a);
            this.dispatch('KeyDown', a);
        };

        BaseGame.prototype.onResize = function () {
            this.dispatch('Resize');
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        BaseGame.prototype.render = function () {
            this.dispatch('Render');
            this.controls.frame(this.fpsCounter.getFrameTime());
            this.fpsCounter.frame();
            this.renderer.render(this.scene.scene, this.camera);
        };
        return BaseGame;
    })(HG.EventDispatcher);
    HG.BaseGame = BaseGame;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Debugger = (function () {
        function Debugger(directory) {
            // var path = require("path");
            // path.resolve(__dirname, Args._[0])
        }
        return Debugger;
    })();
    HG.Debugger = Debugger;
})(HG || (HG = {}));
///<reference path="EventDispatcher" />
var HG;
(function (HG) {
    HG.DefaultEntityParams = {
        extra: {},
        position: new THREE.Vector3(),
        rotation: new THREE.Vector3(),
        targetPosition: new THREE.Vector3(),
        object: new THREE.Object3D()
    };

    var Entity = (function (_super) {
        __extends(Entity, _super);
        function Entity(params) {
            _super.call(this);
            this.children = [];
            if (params.extra !== {}) {
                for (var key in params.extra) {
                    this.object[key] = params.extra[key];
                }
            }
            this.object = params.object;
            this.object.position = params.position;
            this.object.rotation = params.rotation;
        }
        Entity.prototype.set = function (key, value) {
            if (this.children.length > 0) {
                this.children.forEach(function (c) {
                    c.set(key, value);
                });
            }
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

        Entity.prototype.get = function (key) {
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

        Entity.prototype.collectChildren = function () {
            var result = [];
            result.push(this);
            if (this.children.length > 0) {
                this.children.forEach(function (c) {
                    result.push(c);
                });
            }
            return result;
        };

        Entity.prototype.connect = function (e) {
            this.children.push(e);
            return this;
        };
        return Entity;
    })(HG.EventDispatcher);
    HG.Entity = Entity;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var FPSCounter = (function () {
        function FPSCounter() {
            this.lastFrameTime = 0;
            this.lastSecond = 0;
            this.currentFrames = 0;
            this.frameTime = 0;
            this.fps = 0;
            this.lastFrameTime = new Date().getTime();
        }
        FPSCounter.prototype.getFPS = function () {
            return this.fps;
        };

        FPSCounter.prototype.getFrameTime = function () {
            return this.frameTime;
        };

        FPSCounter.prototype.frame = function () {
            var Now = new Date();
            var Diff = new Date(Now.getTime() - this.lastFrameTime);

            //FrameTime
            this.frameTime = Diff.getTime();
            this.lastFrameTime = Now.getTime();

            //FPS
            var FPSDiff = new Date(Now.getTime() - this.lastSecond);
            if (FPSDiff.getSeconds() > 0) {
                this.fps = this.currentFrames;
                this.currentFrames = 0;
                this.lastSecond = Now.getTime();
            }
            this.currentFrames++;
        };
        return FPSCounter;
    })();
    HG.FPSCounter = FPSCounter;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var GameComponent = (function () {
        function GameComponent() {
        }
        return GameComponent;
    })();
    HG.GameComponent = GameComponent;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var InputHandler = (function (_super) {
        __extends(InputHandler, _super);
        function InputHandler() {
            _super.call(this);
            this.keyState = [];
            this.bind = this.on;
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
                    this.dispatch(i, delta);
                }
            }
            ;
        };
        return InputHandler;
    })(HG.EventDispatcher);
    HG.InputHandler = InputHandler;
})(HG || (HG = {}));
/// <reference path="lib/three.d.ts"/>
var HG;
(function (HG) {
    var Level = (function () {
        function Level() {
        }
        Level.prototype.load = function (Raw) {
            return this;
        };

        Level.prototype.loadAsync = function (Url) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (req) {
                if (this.readyState === 4) {
                    console.log(this.responseText);
                }
            };
            req.open("GET", Url, true);
            req.send();
        };

        Level.prototype.create = function (Seed) {
            return this;
        };
        return Level;
    })();
    HG.Level = Level;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Scene = (function () {
        function Scene() {
            this.scene = null;
            this.scene = new THREE.Scene();
        }
        Scene.prototype.add = function (Entity) {
            var c = Entity.collectChildren();
            for (var i = 0; i < c.length; ++i) {
                this.scene.add(c[i].object);
            }
        };

        Scene.prototype.get = function (index) {
            return this.scene.children[index];
        };
        return Scene;
    })();
    HG.Scene = Scene;
})(HG || (HG = {}));
var HG;
(function (HG) {
    HG.Settings = {
        fov: 110,
        tileSize: 50,
        viewDistance: 4800,
        debug: {
            Enabled: true,
            PositionX: 2000
        },
        shadowMapSize: 2048,
        colorKey: "3c",
        antialiasing: true,
        levelURL: "http://lina/dev/projects/HorribleGame/assets/levels/level.json",
        keys: {
            D: 68,
            A: 65,
            S: 115,
            W: 119,
            Space: 32,
            Esc: 27
        },
        pattern: [
            [
                [1, 1, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1]
            ],
            [
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 0, 0, 0, 1]
            ],
            [
                [1, 1, 1, 1, 0, 0, 0, 1],
                [1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1]
            ],
            [
                [1, 1, 1, 1, 0, 0, 0, 1],
                [1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 1, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 0, 0, 0, 1]
            ],
            [
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 1]
            ]
        ]
    };
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.rgbToHex = function (input, prefix) {
            if (!(input instanceof Array))
                input = [input];
            if (input.length < 3) {
                for (var i = 0; i < 2; i++) {
                    input.push(input[0]);
                }
            }
            var Hex = prefix || "0x";
            input.each(function (c) {
                var h = parseInt(c, 0).toString(16);
                if (h.length < 2)
                    Hex += "0" + h;
else
                    Hex += h;
            });
            return Hex;
        };

        Utils.hasGL = function () {
            return (window.WebGLRenderingContext) ? true : false;
        };
        return Utils;
    })();
    HG.Utils = Utils;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var MovingEntity = (function (_super) {
        __extends(MovingEntity, _super);
        function MovingEntity() {
            _super.apply(this, arguments);
        }
        return MovingEntity;
    })(HG.Entity);
    HG.MovingEntity = MovingEntity;
})(HG || (HG = {}));
var HG;
(function (HG) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.apply(this, arguments);
        }
        return Player;
    })(HG.Entity);
    HG.Player = Player;
})(HG || (HG = {}));
var Game = new HG.BaseGame(document.getElementById("gameWrapper"), new THREE.Color(0x000000));

Game.on('PreLoad', function () {
    var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    var Player = new HG.Entity({
        position: new THREE.Vector3(0, 0, 0),
        object: cube
    });
    var PlayerLight = new HG.Entity({
        position: new THREE.Vector3(0, 0, 0),
        object: new THREE.PointLight(0x00ff00, 3, 250)
    });
    Player.connect(PlayerLight);
    Game.scene.add(Player);

    var cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshPhongMaterial({ color: 0xababab }));
    var d = new HG.Entity({
        position: new THREE.Vector3(0, -50, 0),
        object: cube
    });
    Game.scene.add(d);
    Game.camera.position.z = 250;
    Game.camera.rotation.x = 75;
    Game.camera.rotation.y = 75;
});

Game.on('start', function () {
    window.onresize = function () {
        Game.onResize();
    };
    window.onkeydown = function (a) {
        Game.onKeyDown(a);
    };
    window.onkeyup = function (a) {
        Game.onKeyUp(a);
    };
    var r = function () {
        Game.render();
        requestAnimationFrame(r);
    };
    r();
});

Game.controls.bind(HG.Settings.keys.Esc, function (delta) {
    document.getElementById("menuWrapper").style.display = 'block';
    document.getElementById("gameWrapper").style.display = 'none';
});

Game.controls.bind(HG.Settings.keys.A, function (delta) {
    Game.scene.get(0).position.x -= 0.3125 * delta[0];
    Game.scene.get(1).position.x -= 0.3125 * delta[0];
    Game.camera.position.x -= 0.3125 * delta[0];
});

Game.controls.bind(HG.Settings.keys.D, function (delta) {
    Game.scene.get(0).position.x += 0.3125 * delta[0];
    Game.scene.get(1).position.x += 0.3125 * delta[0];
    Game.camera.position.x += 0.3125 * delta[0];
});

Game.on(['start', 'resize'], function () {
    document.getElementById("resolution").innerText = "Rendering on: " + window.innerWidth + "x" + window.innerHeight;
});

Game.on("render", function () {
    document.getElementById("fps").innerText = "FPS: " + Game.fpsCounter.getFPS();
    document.getElementById("frametime").innerText = "Frametime: " + Game.fpsCounter.getFrameTime() + "ms";
});

window.onload = function () {
    Game.preLoad();
};
document.getElementById("exit").onclick = function () {
    window.close();
};
document.getElementById("play").onclick = function () {
    document.getElementById("gameWrapper").style.display = 'block';
    document.getElementById("menuWrapper").style.display = 'none';
    if (Game.isRunning === false) {
        Game.start();
    }
};
