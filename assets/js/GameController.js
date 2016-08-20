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
    // it's the player1 turn, on human-cpu game this represents the
    // human player
    if(game.isPlayerOneTurn()) {
      console.log(game.isPlacingPhase());
      if(game.isPlacingPhase()) {
        var vertices = game.gamefield.vertices;
        for(var i = 0; i< vertices.length;i++) {
          if(vertices[i].contains(x,y) && !isTokenOnField(i)) {
            game.createToken(vertices[i].x,vertices[i].y,i);
            drawController.redraw();
            game.changeTurn();
            break;
          }
        }
      }



    } else {
      // do nothing: it's CPUs turn and user tried to do s.th.
      // TODO: remove test
      var vertices = game.gamefield.vertices;
          for(var i = 0; i< vertices.length;i++) {
                    //var coord = game.convertVertexPosToArrayPos(i);
                    //console.log(coord);
                  if(!isTokenOnField(i)) {
                    //console.log(game.gamefield.field[coord.z][coord.y][coord.x]);
                    game.createToken(vertices[i].x,vertices[i].y,i);
                    drawController.drawVertex(vertices[i].x, vertices[i].y, "#00FF00")
                    game.changeTurn();
                    break;
                  }
            }
      }
  }

  function isTokenOnField(vertIndex) {
    var coord = game.convertVertexPosToArrayPos(vertIndex);
    if(game.gamefield.field[coord.z][coord.y][coord.x]) {
      return true;
    }
    return false;
  }
}
