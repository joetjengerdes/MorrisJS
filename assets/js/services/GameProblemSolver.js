function GameProblemSolver(game) {
  var game = game;


  this.isMorris = function(token) {
    var field = game.gamefield.field;
    var vertexId = token.vertexId;

    var coords = game.convertVertexPosToArrayPos(vertexId);

    var currentPlayer = token.player;
field[(coords.z+1)%3][(coords.y+1)%3][(coords.x+1)%3]
    if()

  }
}
