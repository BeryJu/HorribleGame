///<reference path="EventDispatcher" />

module HG {
	
	export class BaseServer extends EventDispatcher {

		socketServer: SocketManager;

		constructor(port: number) {
			super();
			var io = require('socket.io');
			this.socketServer = io.listen(port);
			this.socketServer.set("log level", 1);
			this.socketServer.sockets.on('connection', function (socket) {
				socket.on('my other event', function (data) {
					console.log(data);
				});
			});
		}

	}

}