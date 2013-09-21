var HG;
(function (HG) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.events = {};
        }
        EventDispatcher.prototype.On = function (name, callback) {
            if (Array.isArray(name) === true) {
                for (var i = 0; i < name.length; ++i) {
                    this.On(name[i], callback);
                }
            } else {
                name = name.toLowerCase();
                console.log('Added EventHandler for \'' + name + '\'');
                if (!this.events[name])
                    this.events[name] = [];
                this.events[name].push(callback);
            }
        };

        EventDispatcher.prototype.Clear = function (name) {
            name = name.toLowerCase();
            if (!this.events[name])
                return;
            if (this.events[name].length === 0)
                return;
            this.events[name] = [];
        };

        EventDispatcher.prototype.Dispatch = function (name) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            if (Array.isArray(name) === true) {
                for (var i = 0; i < name.length; ++i) {
                    this.Dispatch(name[i], args);
                }
            } else {
                name = name.toLowerCase();
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
            this.IsRunning = false;
            if (HG.Utils.hasGL() === false) {
                var up = new Error("Your Browser doesn't support WebGL");
                throw up;
            }
            this.Scene = new HG.Scene();
            this.FPSCounter = new HG.FPSCounter();
            this.Renderer = new THREE.WebGLRenderer({ antialias: HG.Settings.Antialiasing });
            this.Camera = new THREE.PerspectiveCamera(HG.Settings.FOV, window.innerWidth / window.innerHeight, 0.1, HG.Settings.ViewDistance);
            this.Renderer.setSize(window.innerWidth, window.innerHeight);
            this.Renderer.setClearColor(clearColor, 1);
            try  {
                container.appendChild(this.Renderer.domElement);
            } catch (e) {
                throw new Error("Container is not a valid HTMLElement");
                console.log(container);
            }
        }
        BaseGame.prototype.PreLoad = function () {
            console.log('loading assets');
            this.Dispatch('PreLoad');
            console.log('loaded assets');
        };

        BaseGame.prototype.Start = function () {
            this.Dispatch('Start');
            this.IsRunning = true;
        };

        BaseGame.prototype.OnKeyPress = function (a) {
            this.Dispatch('KeyPress', a);
        };

        BaseGame.prototype.OnKeyUp = function (a) {
            this.Dispatch('KeyUp', a);
        };

        BaseGame.prototype.OnKeyDown = function (a) {
            this.Dispatch('KeyDown', a);
        };

        BaseGame.prototype.OnResize = function () {
            this.Dispatch('Resize');
            this.Camera.aspect = window.innerWidth / window.innerHeight;
            this.Camera.updateProjectionMatrix();
            this.Renderer.setSize(window.innerWidth, window.innerHeight);
        };

        BaseGame.prototype.Render = function () {
            this.Dispatch('Render');
            this.FPSCounter.Frame();
            this.Renderer.render(this.Scene.Scene, this.Camera);
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
        Extra: {},
        Position: new THREE.Vector3(),
        Rotation: new THREE.Vector3(),
        TargetPosition: new THREE.Vector3(),
        Object: new THREE.Object3D(),
        OnLoad: function (self) {
        },
        OnKeyDown: function (e, self) {
        },
        OnResize: function (self) {
        },
        OnRender: function (self) {
        }
    };

    var Entity = (function (_super) {
        __extends(Entity, _super);
        function Entity(params) {
            _super.call(this);
            this.Children = [];
            if (params.Extra !== {}) {
                for (var key in params.Extra) {
                    this.Object[key] = params.Extra[key];
                }
            }
            this.Object = params.Object;
            this.Object.position = params.Position;
            this.Object.rotation = params.Rotation;
        }
        Entity.prototype.Set = function (key, value) {
            if (this.Children.length > 0) {
                this.Children.forEach(function (c) {
                    c.Set(key, value);
                });
            }
            if (key.indexOf(".") === -1) {
                this.Object[key] = value;
            } else {
                var parts = key.split(".");
                var obj = this.Object;
                for (var i = 0; i < parts.length - 1; i++) {
                    obj = obj[parts[i]];
                }
                obj[parts[length]] = value;
            }
            return this;
        };

        Entity.prototype.Get = function (key) {
            if (key.indexOf(".") === -1) {
                return this.Object[key];
            } else {
                var parts = key.split(".");
                var obj = this.Object;
                for (var i = 0; i < parts.length - 1; i++) {
                    obj = obj[parts[i]];
                }
                return obj[parts[length]];
            }
        };

        Entity.prototype.CollectChildren = function () {
            var result = [];
            if (this.Children.length > 0) {
                this.Children.forEach(function (c) {
                    result.push(c);
                });
            }
            result.push(this);
            return result;
        };

        Entity.prototype.Connect = function (e) {
            this.Children.push(e);
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
            this.LastFrameTime = 0;
            this.LastSecond = 0;
            this.CurrentFrameTime = 0;
            this.CurrentFrames = 0;
            this.FrameTime = 0;
            this.FPS = 0;
            this.LastFrameTime = new Date().getTime();
        }
        FPSCounter.prototype.getFPS = function () {
            return this.FPS;
        };

        FPSCounter.prototype.getFrameTime = function () {
            return this.FrameTime;
        };

        FPSCounter.prototype.Frame = function () {
            var Now = new Date();
            var Diff = new Date(Now.getTime() - this.LastFrameTime);

            //FrameTime
            this.CurrentFrameTime = Diff.getTime();
            this.LastFrameTime = Now.getTime();

            //FPS
            var FPSDiff = new Date(Now.getTime() - this.LastSecond);
            if (FPSDiff.getSeconds() > 0) {
                this.FPS = this.CurrentFrames;
                this.FrameTime = this.CurrentFrameTime;
                this.CurrentFrames = 0;
                this.LastSecond = Now.getTime();
            }
            this.CurrentFrames++;
        };
        return FPSCounter;
    })();
    HG.FPSCounter = FPSCounter;
})(HG || (HG = {}));
/// <reference path="lib/three.d.ts"/>
var HG;
(function (HG) {
    var Level = (function () {
        function Level() {
        }
        Level.prototype.Load = function (Raw) {
            return this;
        };

        Level.prototype.LoadAsync = function (Url) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function (req) {
                if (this.readyState === 4) {
                    console.log(this.responseText);
                }
            };
            req.open("GET", Url, true);
            req.send();
        };

        Level.prototype.Create = function (Seed) {
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
            this.Scene = null;
            this.Scene = new THREE.Scene();
        }
        Scene.prototype.add = function (Entity) {
            var c = Entity.CollectChildren();
            for (var i = 0; i < c.length; ++i) {
                this.Scene.add(c[i].Object);
            }
        };
        return Scene;
    })();
    HG.Scene = Scene;
})(HG || (HG = {}));
var HG;
(function (HG) {
    HG.Settings = {
        FOV: 110,
        TileSize: 50,
        ViewDistance: 4800,
        Debug: {
            Enabled: true,
            PositionX: 2000
        },
        ShadowMapSize: 2048,
        ColorKey: "3c",
        Antialiasing: true,
        LevelURL: "http://lina/dev/projects/HorribleGame/assets/levels/level.json",
        Keys: {
            D: 100,
            A: 97,
            S: 115,
            W: 119,
            Space: 32
        },
        Pattern: [
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
        Utils.RGBToHex = function (input, prefix) {
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

Game.On('PreLoad', function () {
    var geometry = new THREE.CubeGeometry(50, 50, 50);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    var Player = new HG.Entity({
        Position: new THREE.Vector3(0, 0, 0),
        Object: cube
    });
    var PlayerLight = new HG.Entity({
        Position: new THREE.Vector3(0, 0, 0),
        Object: new THREE.PointLight(0xffffff, 1, 100)
    });
    Player.Connect(PlayerLight);
    Game.Scene.add(Player);

    var g = new THREE.CubeGeometry(50, 50, 50);
    var m = new THREE.MeshPhongMaterial({ color: 0xababab });
    var cube = new THREE.Mesh(g, m);
    var d = new HG.Entity({
        Position: new THREE.Vector3(50, -50, 0),
        Object: cube
    });
    Game.Scene.add(d);
    Game.Scene.add(new HG.Entity({
        Position: new THREE.Vector3(50, 50, 0),
        Object: cube
    }));
    Game.Camera.position.z = 250;
    Game.Camera.rotation.x = 75;
    Game.Camera.rotation.y = 75;
});

Game.On('start', function () {
    window.onresize = function () {
        Game.OnResize();
    };
    window.onkeydown = function (a) {
        Game.OnKeyDown(a);
    };
    window.onkeyup = function (a) {
        Game.OnKeyUp(a);
    };
    window.onkeypress = function (a) {
        Game.OnKeyPress(a);
    };
    var r = function () {
        Game.Render();
        requestAnimationFrame(r);
    };
    r();
});

Game.On('keydown', function (e) {
    if (e[0].keyCode === 27) {
        //esc key
        document.getElementById("menuWrapper").style.display = 'block';
        document.getElementById("gameWrapper").style.display = 'none';
    } else if (e[0].keyCode === 83) {
        Game.Camera.position.z -= 5;
    } else if (e[0].keyCode === 87) {
        Game.Camera.position.z += 5;
    } else {
        console.log(e[0].keyCode);
    }
});

Game.On(['start', 'resize'], function () {
    document.getElementById("resolution").innerText = "Rendering on: " + window.innerWidth + "x" + window.innerHeight;
});

Game.On("render", function () {
    document.getElementById("fps").innerText = "FPS: " + Game.FPSCounter.getFPS();
    document.getElementById("frametime").innerText = "Frametime: " + Game.FPSCounter.getFrameTime() + "ms";
});
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        Game.PreLoad();
    }
};
document.getElementById("exit").onclick = function () {
    window.close();
};
document.getElementById("play").onclick = function () {
    document.getElementById("gameWrapper").style.display = 'block';
    document.getElementById("menuWrapper").style.display = 'none';
    if (Game.IsRunning === false) {
        Game.Start();
    }
};
