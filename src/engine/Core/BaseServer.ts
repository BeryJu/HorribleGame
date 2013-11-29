/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:25:47
*/
///<reference path="EventDispatcher" />

module HG.Core {
	
	export class BaseServer extends HG.Core.EventDispatcher {

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