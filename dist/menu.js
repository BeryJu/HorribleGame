var taglines = [
	"It's a thing",
	"It's Horrible",
	"Terrible",
	"A Horror Puzzle Platformer",
	"Made by one guy",
	"THREE.js"
];
var tagline = taglines[Math.floor(Math.random()*taglines.length)];
// document.getElementById("tagline").innerText = tagline;
console.log(tagline);

// document.getElementById("options").onclick = function() {
// 	document.getElementById("optionsC").style.display = 'block';
// 	document.getElementById("menu").style.display = 'none';
// };
// document.getElementById("back").onclick = function() {
// 	document.getElementById("optionsC").style.display = 'none';
// 	document.getElementById("menu").style.display = 'block';
// };

// if (typeof process === 'undefined') {
// 	document.getElementById("devTools").style.display = 'none';
// 	document.getElementById("devTools").style.display = 'none';
// }

// document.getElementById("devTools").onclick = function() {
// 	require('nw.gui').Window.get().showDevTools();
// }