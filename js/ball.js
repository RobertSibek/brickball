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
					ballSpeedX *= -1
					bothTestsFailed = false;
				}
				
			}
			
			if (prevBrickRow != ballBrickRow) {
				
				if (isBrickAtColRow(ballBrickCol, ballBrickRow) == false) {
					
					ballSpeedY *= -1
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
	var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
	var paddleLeftEdgeX = paddleX
	var paddleRightEdgeX = paddleX + PADDLE_WIDTH
	if (ballY > paddleTopEdgeY && // below top of the paddle
		ballY < paddleBottomEdgeY && // above bottom of the paddle
		ballX > paddleLeftEdgeX && // right of the left side of paddle
		ballX < paddleRightEdgeX // left of the right side of paddle
	) {
		ballSpeedY *= -1
		var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
		var ballDistFromPaddleCenterX = ballX - centerOfPaddleX
		ballSpeedX = ballDistFromPaddleCenterX * 0.15
		sfxPaddleHit.play();
	}
	if (noBricksLeft()) {
		brickReset();
	}
}

function ballReset() {
	ballX = canvas.width / 2;
	ballY = CANVAS_HEIGHT - PADDLE_DIST_FROM_EDGE - PADDLE_THICKNESS - 5 ;
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
		ballSpeedX *= -1
	}
	if (ballX < 0 && ballSpeedX < 0.0) {
		ballSpeedX *= -1
	}
	if (ballY > canvas.height) {
		sfxBallLoose.play();
		ballReset();
	}
	if (ballY < 0 && ballSpeedY < 0.0) {
		ballSpeedY *= -1
	}
}