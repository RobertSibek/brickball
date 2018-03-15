//function chanePaddleColor() {
//	clRed = Math.floor((Math.random() * 255) + 1);
//	clGreen = Math.floor((Math.random() * 255) + 1);
//	clBlue = Math.floor((Math.random() * 255) + 1);
//	paddle_color = "rgba(" + clRed + "," + clGreen + "," + clBlue + ", 1.0)";
//}

function paddleRect(x, y, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.strokeStyle = 'white';
	canvasContext.fillRect(x, y, width, height);
	canvasContext.strokeRect(x, y, width, height);
}