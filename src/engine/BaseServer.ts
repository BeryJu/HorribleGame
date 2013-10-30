///<reference path="EventDispatcher" />

module HG {
	
	export class BaseServer extends EventDispatcher {

		socketServer: SocketManager;

		constructor(port: number) {
			super();
			this.socketServer = global['socket.io'].listen(port);
			this.socketServer.set("log level", 1);
			this.socketServer.sockets.on('connection', (socket) => {
				socket.on('my other event', (data) => {
					console.log(data);
				});
			});
		}

	}

}