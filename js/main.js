// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 15;
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
const BRICK_GAP = 2;
const BALL_RADIUS = 10;
const BALL_STARTING_SPEED = 1;
const START_LIFES = 3;
const MENU_WIDTH = 30;

// Variables
var canvas, canvasContext;
var ballSpeedX = BALL_STARTING_SPEED;
var ballSpeedY = BALL_STARTING_SPEED;
var paddleX = (CANVAS_WIDTH / 2) - PADDLE_WIDTH / 2;
var ballX = CANVAS_WIDTH / 2 - BALL_RADIUS;
var ballY = CANVAS_HEIGHT - PADDLE_DIST_FROM_EDGE;
var mouseX;
var clRed = 255;
var clGreen = 0;
var clBlue = 0;
var lifes = START_LIFES;
var paddle_color = "rgba(" + clRed + "," + clGreen + "," + clBlue + ", 0.5)";
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var isPlaying = false;
var isGameOver = true;

// Load Sounds
var sfxPaddleHit = new Audio("sounds/hit.wav");
var sfxBallLoose = new Audio("sounds/loose.wav");
var sfxBrickHit = new Audio("sounds/brick_hit.wav");
var sfxEndMusic = new Audio("sounds/EndMusic.wav");

window.onload = function () {
	canvas = document.createElement("canvas");
	canvas.id = "game";
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvas.style.zIndex = 8;
	canvas.style.position = "absolute";
	canvas.style.border = "1px solid";

	var body = document.getElementsByTagName("body")[0];
	body.appendChild(canvas);

	//	canvas = document.getElementById("game");
	canvasContext = canvas.getContext("2d");
	var fps = 30;
	setInterval(updateAll, 100 / fps);
	canvas.addEventListener("mousemove", updateMousePos);
	canvas.addEventListener("click", startGame);
	brickReset();
	ballReset();
	
};

// Handle Input
function updateMousePos(evt) {
	if (!isGameOver) {
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		mouseX = evt.clientX - rect.left - root.scrollLeft;	
		paddleX = value_limit(mouseX - PADDLE_WIDTH / 2, 0, CANVAS_WIDTH - PADDLE_WIDTH);
	}
}

function value_limit(val, min, max) {
	return val < min ? min : (val > max ? max : val);
}

function updateAll() {
	moveAll();
	drawAll();
}

function startGame() {
	if (!isPlaying) {
		isPlaying = true;
		isGameOver = false;
		//		lifes = START_LIFES;
	}
}

function gameOver() {
	sfxEndMusic.play();
	isGameOver = true;
	isPlaying = false;
	
}

function updateLifes() {
	if (lifes > 0) {
		lifes -= 1;
	
	} else {		
		gameOver();
	}
}

function moveAll() {
	ballMove();
	ballBrickHandling();
	ballPaddleHandling();
}

function drawMenu() {
	colorRect(0, 0, CANVAS_WIDTH, MENU_WIDTH, "red");
}

function drawAll() {
	// Draw Background
	colorRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "black");
	drawMenu();
	colorCircle(ballX, ballY, BALL_RADIUS, "white");
	paddleRect(paddleX, CANVAS_HEIGHT - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, paddle_color);
	drawBricks();
}

function ballBrickHandling() {

	var ballBrickCol = Math.floor(ballX / BRICK_W);
	var ballBrickRow = Math.floor(ballY / BRICK_H);
	var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

	if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

		if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {

			removeBrick(brickIndexUnderBall);
			var prevBallX = ballX - ballSpeedX;
			var prevBallY = ballY - ballSpeedY;
			var prevBrickCol = Math.floor(prevBallX / BRICK_W);
			var prevBrickRow = Math.floor(prevBallY / BRICK_H);
			var bothTestsFailed = true;

			if (prevBrickCol != ballBrickCol) {

				if (isBrickAtColRow(prevBrickCol, prevBrickRow) == false) {
					ballSpeedX *= -1;
					bothTestsFailed = false;
				}

			}

			if (prevBrickRow != ballBrickRow) {

				if (isBrickAtColRow(ballBrickCol, ballBrickRow) == false) {

					ballSpeedY *= -1;
					bothTestsFailed = false;
				}
			}

			// Armpit case
			if (bothTestsFailed) {
				ballSpeedX *= -1;
				ballSpeedY *= -1;
			}
		}
	}
}

function ballPaddleHandling() {
	var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleX + PADDLE_WIDTH;
	if (ballY > paddleTopEdgeY && // below top of the paddle
			ballY < paddleBottomEdgeY && // above bottom of the paddle
			ballX > paddleLeftEdgeX && // right of the left side of paddle
			ballX < paddleRightEdgeX // left of the right side of paddle
	) {
		ballSpeedY *= -1;
		var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
		var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
		ballSpeedX = ballDistFromPaddleCenterX * 0.15;
		sfxPaddleHit.play();
	}
	if (noBricksLeft()) {
		brickReset();
	}
}

function ballReset() {
	ballX = canvas.width / 2;
	ballY = CANVAS_HEIGHT - PADDLE_DIST_FROM_EDGE - PADDLE_THICKNESS - 5;
	ballSpeedX = BALL_STARTING_SPEED;
	ballSpeedY = BALL_STARTING_SPEED;
	isPlaying = false;
}

function ballMove() {

	if (isPlaying) {
		ballX += ballSpeedX;
		ballY -= ballSpeedY;
	} else {
		ballX = paddleX + PADDLE_WIDTH / 2;
	}


	if (ballX > canvas.width && ballSpeedX > 0.0) {
		ballSpeedX *= -1;
	}
	if (ballX < 0 && ballSpeedX < 0.0) {
		ballSpeedX *= -1;
	}
	if (ballY > canvas.height) {
		sfxBallLoose.play();
		updateLifes();
		ballReset();
	}
	if (ballY < 0 && ballSpeedY < 0.0) {
		ballSpeedY *= -1;
	}
}

// Bricks part
function isBrickAtColRow(col, row) {
	if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {
		var brickIndexUnderCoord = rowColToArrayIndex(col, row);
		return brickGrid[brickIndexUnderCoord];
	} else {
		return false;
	}
}

function noBricksLeft() {
	for (var i = 0; i <= BRICK_COLS * BRICK_ROWS; i++) {
		if (brickGrid[i]) {
			return false;
		}
	}
	return true;
}

function removeBrick(brickIndex) {
	brickGrid[brickIndex] = false;
	sfxBrickHit.play();
}

function rowColToArrayIndex(col, row) {
	return col + BRICK_COLS * row;
}

function drawBricks() {
	for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
			var arrayIndex = BRICK_COLS * eachRow + eachCol;
			if (brickGrid[arrayIndex]) {
				colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, "blue");
			}
		}
	}
}

function brickReset() {
	var i = 0;
	for (; i < 3 * BRICK_COLS; i++) {
		brickGrid[i] = false;
	}
	for (; i < BRICK_COLS * BRICK_ROWS; i++) {
		brickGrid[i] = true;
	} // end of for
}

// Draw Paddle
function paddleRect(x, y, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.strokeStyle = "white";
	canvasContext.fillRect(x, y, width, height);
	canvasContext.strokeRect(x, y, width, height);
}

// Common graphics
function colorRect(x, y, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x, y, width, height);
}

function colorCircle(x, y, radius, color) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}
