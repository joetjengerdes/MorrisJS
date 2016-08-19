function EventController(canvas) {
	var canvas = canvas;
	var gameController = null;

	this.setGameController = function(controller) {
		gameController = controller;
	}

	this.getGameController = function() {
		return gameController;
	}

	function initController() {
		canvas.addEventListener('selectstart', function(e) {
			 e.preventDefault();
			 return false;
		}, false);

		canvas.addEventListener('mouseup', function(e) {
		var mouse = getMouse(e);
		var x = mouse.x;
		var y = mouse.y;

		gameController.doAction(mouse.x, mouse.y);

		});
	}

	//return relative position to canvas
	function getMouse(e) {
		var x;
		var y;
		if (e.pageX || e.pageY) {
			x = e.pageX;
			y = e.pageY;
		}
		else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;

		var mouseClick = {
			x: x,
			y: y
		}
		return mouseClick;
}
	initController();
}
