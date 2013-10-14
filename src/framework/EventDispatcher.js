var HG;
(function (HG) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.events = {};
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
                console.log('Added EventHandler for \'' + name + '\'');
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
