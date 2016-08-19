function EventController(canvas, gamefield) {
	var canvas = canvas;
	var gameController = null;
	var drawController = null;
	var sizeCalculationService = new SizeCalculationService(canvas, gamefield);
	// timeout used for resizing, so calculation
	// is not done by every frame change
	var resizeTimeout = null;
	var mouseMoveTimeout = null;

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
			if (resizeTimeout != null) {
        clearTimeout(resizeTimeout);
			}
			resizeTimeout = setTimeout(function(){
				sizeCalculationService.calculate();
				drawController.redraw();
    	}, 200);
		}

		canvas.addEventListener('mousemove', function(e) {
			if(mouseMoveTimeout != null) {
				clearTimeout(mouseMoveTimeout);
			}
			mouseMoveTimeout = setTimeout(function() {
				var mouse = getMouse(e);
				drawController.redraw();
				// TODO: mark selection
				for(var i = 0; i < gamefield.vertices.length; i++) {
					var v = gamefield.vertices[i];
					if(v.contains(mouse.x, mouse.y)) {
							drawController.drawVertex(v.x, v.y, 'rgba(0,0,0,0.2)');
					}
				}

			}, 5);

		});
		// do first calculation
		sizeCalculationService.calculate();
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
