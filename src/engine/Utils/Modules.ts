/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 21:06:46
*/

module HG.Modules {

	export var fs = require('fs');
	export var path = require('path');
	export var http = require('http');
	export var ui;
	export var socketio = {
		server: require('socket.io'),
		client: require('socket.io-client')
	};

}