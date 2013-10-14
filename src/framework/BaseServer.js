///<reference path="EventDispatcher" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HG;
(function (HG) {
    var BaseServer = (function (_super) {
        __extends(BaseServer, _super);
        function BaseServer(port) {
            _super.call(this);
            var io = require('socket.io');
            try  {
                this.socketServer = io.listen(port);
            } catch (e) {
                console.error(e);
            }
            this.socketServer.sockets.on('connection', function (socket) {
                socket.emit('news', { hello: 'world' });
                socket.on('my other event', function (data) {
                    console.log(data);
                });
            });
        }
        return BaseServer;
    })(HG.EventDispatcher);
    HG.BaseServer = BaseServer;
})(HG || (HG = {}));
