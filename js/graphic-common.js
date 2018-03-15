function colorText(showWords, x, y, color) {
	canvasContext.fillStyle = color
	canvasContext.fillText(showWords, x, y);
}

function colorRect(x, y, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, width, height);
}

function colorCircle(x, y, radius, color) {
	canvasContext.fillStyle = color
	canvasContext.beginPath();
	canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}