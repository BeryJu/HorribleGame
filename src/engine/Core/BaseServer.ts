/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-05 19:45:42
*/

module HG.Core {

	export class BaseServer extends HG.Core.EventDispatcher {

		clients: HG.Core.ServerConnection[];

		constructor(port: number) {
			super();
			this.clients = [];
			HG.Modules.net.createServer(this.onSocket).listen(port);
		}

		broadcast(message: any, sender?: HG.Core.ServerConnection): void {
			this.clients.forEach((client) => {
				if (client !== sender) {
					client.write(message);
				}
			});
			HG.log(message);
		}

		onSocket(socket: any): void {
			// Identify this client
			socket.name = socket.remoteAddress + ":" + socket.remotePort;

			// Put this new client in the list
			this.clients.push(new HG.Core.ServerConnection(socket));

			// // Send a nice welcome message and announce
			// socket.write("Welcome " + socket.name + "\n");
			// broadcast(socket.name + " joined the chat\n", socket);

			// // Handle incoming messages from clients.
			// socket.on("data", function (data) {
			// 	broadcast(socket.name + "> " + data, socket);
			// });

			// // Remove the client from the list when it leaves
			// socket.on("end", function () {
			// clients.splice(clients.indexOf(socket), 1);
			// broadcast(socket.name + " left the chat.\n");
			// });
		}

	}

}