var taglines = [
	"It's a thing",
	"It's Horrible",
	"Terrible",
	"A Horror Puzzle Platformer",
	"Made by one guy",
	"THREE.js"
];
document.getElementById("tagline").innerText = taglines[Math.floor(Math.random()*taglines.length)];

document.getElementById("options").onclick = function() {
	document.getElementById("optionsC").style.display = 'block';
	document.getElementById("menu").style.display = 'none';
};
document.getElementById("back").onclick = function() {
	document.getElementById("optionsC").style.display = 'none';
	document.getElementById("menu").style.display = 'block';
};