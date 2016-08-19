function GameController(game) {
  this.valid = false;
  this.game = game;
  var controller = this;
  var eventController = null;
  var drawController = null;

  this.setDrawController = function(drawController_) {
    drawController = drawController_;
  }

  this.getDrawController = function() {
    return drawController;
  }

  this.setEventController = function(eventController) {
    this.eventController = eventController;
  }

  this.getEventController = function() {
    return eventController;
  }

  this.doAction = function(x,y) {
    // it's the human players turn
    if(game.isHumansTurn()) {
      if(game.mode == 0) {
        if(game.tokensPlaced >= 18) {
          game.mode = 1;
        }
        var vertices = game.gamefield.vertices;
        for(var i = 0; i< vertices.length;i++) {
          if(vertices[i].contains(x,y)) {
            game.createToken(vertices[i].x,vertices[i].y,i);
            drawController.drawVertex(vertices[i].x, vertices[i].y, "#FF0000");
            game.changeTurn();
          }
        }
      }



    } else {
      // do nothing: it's CPUs turn and user tried to do s.th.
      // TODO: remove test
      drawController.drawVertex(Math.random() * 600, Math.random() * 600, "#00FF00")
      game.changeTurn();
    }


  }

  this.draw = function(ctx, posX, posY, size) {
     ctx.fillStyle = 'rgb(0,255,0)';
     ctx.beginPath();
     ctx.arc(posX, posY, circleSize, 0, 2 * Math.PI, false);
     ctx.fill();
     ctx.stroke();
  }

  /*this.initGame = function() {
    canvas.addEventListener('mousedown', function(e) {
      var mouse = controller.getMouse(e);
      controller.doAction(mouse);
    });
    canvas.addEventListener('selectstart', function(e) {
       e.preventDefault();
       return false;
    }, false);
  }

  this.getMouse = function(e) {
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

  this.initGame();*/
}
