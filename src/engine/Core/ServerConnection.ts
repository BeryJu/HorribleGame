/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-05 19:45:35
*/

module HG.Core {

	export class ServerConnection extends HG.Core.EventDispatcher {

		socket: any;

		constructor(socket: any) {
			super();
			this.socket = socket;
		}

		write = this.socket.write;

	}

}