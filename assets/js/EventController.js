function EventController(canvas, gamefield) {
	var canvas = canvas;
	var gameController = null;
	var DrawController = null;
	var sizeCalculationService = new SizeCalculationService(canvas, gamefield);

	this.setGameController = function(controller) {
		gameController = controller;
	}

	this.getGameController = function() {
		return gameController;
	}

	this.setDrawController = function(drawc) {
		drawController = drawc;
	}

	this.getDrawController = function() {
		return drawController;
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

		window.onresize = function() {
			sizeCalculationService.calculate();
			drawController.redraw();
		}
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
