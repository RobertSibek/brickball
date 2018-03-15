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
}

function rowColToArrayIndex(col, row) {
	return col + BRICK_COLS * row;
}

function drawBricks() {
	for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
			var arrayIndex = BRICK_COLS * eachRow + eachCol;
			if (brickGrid[arrayIndex]) {
				colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
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