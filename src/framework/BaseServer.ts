///<reference path="EventDispatcher" />

module HG {
	
	export class BaseServer extends EventDispatcher {

		socketServer: SocketManager;

		constructor(port: number) {
			super();
			var io = require('socket.io');
			try {
				this.socketServer = io.listen(port);
			} catch (e) {
				console.error(e);
			}
			for (var k in this) {
				console.log(k);
			}
			this.socketServer.sockets.on('connection', function (socket) {
				socket.on('my other event', function (data) {
					console.log(data);
				});
			});
		}

	}

}