var fs = require("fs");
var width = 96;
var height = 8;
var levelData = [];
for (var y = 0; y < width; y++) {
	var col = [];
	for (var x = 0; x < height; x++) {
		col.push({
			geometry: "cube",
			type: Math.floor(Math.random() * (3)),
			level: 1
		});
	};
	levelData.push(col);
};

fs.writeFileSync("level.json", JSON.stringify({
	Level: levelData,
	Start: [95, 7]
}));
