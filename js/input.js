function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
	paddleX = value_limit(mouseX - PADDLE_WIDTH / 2, 0, CANVAS_WIDTH - PADDLE_WIDTH);
}

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}