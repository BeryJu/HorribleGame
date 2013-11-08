/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-06 15:08:44
*/
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