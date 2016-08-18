function GameController(canvas, game) {
  this.valid = false;
  this.game = game;
  this.selection = null;
  this.canvas = canvas;
  var controller = this;


  this.doAction = function(mouse) {
    // it's the human players turn
    if(game.isHumansTurn()) {
      if(game.mode == 0) {
        var token = new PlayerToken(mouse.x, mouse.y);
        var ctx = canvas.getContext("2d");
        controller.draw(ctx, mouse.x, mouse.y, 10);
      }

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

  this.initGame = function() {
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

  this.initGame();
}
