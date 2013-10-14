module HG {

	export class ServerConnection extends EventDispatcher {

		socket: Socket;

		constructor(host: string) {
			super();
			var io = require('socket.io-client');
			this.socket = io.connect(host);
			this.socket.emit("join", {

			});
		}

		// fetchLevel(): HG.Level {
		// 	// this.socket.emit("fetchLevel");
		// }

	}

}