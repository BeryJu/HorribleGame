module.exports = function(host, env) {
	this.name = "test";
	this.env = env;
	this.host = host;

	this.env.game.on("keyDown", function(a) {
		if (a.keyCode === 32) env.window.console.log("space!!!");
	});

	// this.frame = function(detla) {

	// };
};