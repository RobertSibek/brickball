window.onload = function () {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");
	var fps = 30;
	setInterval(updateAll, 100 / fps);
	canvas.addEventListener("mousemove", updateMousePos);
	canvas.addEventListener("click", startGame);
	brickReset();
	ballReset();
};

function updateAll() {
	moveAll();
	drawAll();
}

function startGame() {
	if (!isPlaying) {
		isPlaying = true;	
	}
	
}

function moveAll() {
	ballMove();				
	ballBrickHandling();
	ballPaddleHandling();
}

function drawAll() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorCircle(ballX, ballY, BALL_RADIUS, 'white');
	paddleRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, paddle_color);
	drawBricks();
}