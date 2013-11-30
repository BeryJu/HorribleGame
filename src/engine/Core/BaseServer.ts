/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 21:56:58
*/
///<reference path="EventDispatcher" />

module HG.Core {

	export class BaseServer extends HG.Core.EventDispatcher {

		socketServer: SocketManager;

		constructor(port: number) {
			super();
			this.socketServer = HG.Modules.socketio.server.listen(port);
			this.socketServer.set("log level", 1);
			this.socketServer.sockets.on('connection', (socket) => {
				socket.on('my other event', (data) => {
					HG.log(data);
				});
			});
		}

	}

}