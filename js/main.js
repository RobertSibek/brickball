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
const START_lives = 3;
const MENU_WIDTH = 30;
const MENU_FONT = "20px Avenir";
const MENU_Y_POSITION = 22;

// Variables
var canvas, ctx;
var ballSpeedX = BALL_STARTING_SPEED;
var ballSpeedY = BALL_STARTING_SPEED;
var paddleX = (CANVAS_WIDTH / 2) - PADDLE_WIDTH / 2;
var ballX = CANVAS_WIDTH / 2 - BALL_RADIUS;
var ballY = CANVAS_HEIGHT - PADDLE_DIST_FROM_EDGE;
var mouseX;
var clRed = 255;
var clGreen = 0;
var clBlue = 0;
var lives = START_lives;
var paddle_color = "rgba(" + clRed + "," + clGreen + "," + clBlue + ", 0.5)";
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var isPlaying = false;
var isGameOver = true;
var enableSounds = true;

var sfxPaddleHit = new Audio("sounds/hit.wav");
var sfxBallLoose = new Audio("sounds/loose.wav");
var sfxBrickHit = new Audio("sounds/brick_hit.wav");
var sfxEndMusic = new Audio("sounds/EndMusic.mp3");
var sfxEnabled = true;

	class Sound {

		brickHit() {
			if (sfxEnabled) {
				sfxBrickHit.play();
			}
		}

		ballLoose() {
			if (sfxEnabled) {
				sfxBallLoose.play();
			}
		}

		paddleHit() {
			if (sfxEnabled) {
				sfxPaddleHit.play();
			}
		}

		gameOver() {
			if (sfxEnabled) {
				sfxEndMusic.play();
			}
		}
	}

  var sfx = new Sound();


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
	ctx = canvas.getContext("2d");
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
	}
}

function gameOver() {
	sfx.gameOver();
	ballReset();
	isGameOver = true;
	isPlaying = false;
}

function ballReset() {
	ballX = canvas.width / 2;
	ballY = CANVAS_HEIGHT - PADDLE_DIST_FROM_EDGE - PADDLE_THICKNESS - 5;
	
	if (!isGameOver) {
		ballSpeedX = BALL_STARTING_SPEED;
		ballSpeedY = BALL_STARTING_SPEED;
		isPlaying = false;
	}
}

function looseLife() {
	if (lives > 0) {
		lives -= 1;
		sfx.ballLoose();
	}
	
	if (lives === 0)
	{
		gameOver();
	} else {
		ballReset();
	}
}

function moveAll() {
	ballMove();
	ballBrickHandling();
	ballPaddleHandling();
}

function countBricksLeft() {
	var totalBricks = 0;
	for (var x = 0; x < brickGrid.length; x++) {
		if (brickGrid[x]) {
			totalBricks++;
		}
	}
	
	return totalBricks;
}

function drawMenu() {
	colorRect(0, 0, CANVAS_WIDTH, MENU_WIDTH, "red");
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	ctx.font = MENU_FONT;
	const MENU_SPACER = "               ";
	var textString = "Bricks Left: " + countBricksLeft() + MENU_SPACER + "Lives: " + lives;
	var textWidth = Math.round(ctx.measureText(textString).width);
	ctx.fillText(textString, (CANVAS_WIDTH / 2) - Math.round(textWidth / 2), MENU_Y_POSITION, 600);
}

function drawAll() {
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
		sfx.paddleHit();
	}
	if (noBricksLeft()) {
		brickReset();
	}
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
		looseLife();
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
	sfx.brickHit();
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
	ctx.fillStyle = color;
	ctx.strokeStyle = "white";
	ctx.fillRect(x, y, width, height);
	ctx.strokeRect(x, y, width, height);
}

// Common graphics
function colorRect(x, y, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function colorCircle(x, y, radius, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, true);
	ctx.fill();
}
