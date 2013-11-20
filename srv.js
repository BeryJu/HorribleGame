var connect = require('connect');
connect.createServer(
	connect.static("bin/")
).listen(80);