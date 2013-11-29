/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:25:45
*/

module HG {

	export class ServerConnection extends HG.Core.EventDispatcher {

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