function Game(gf, player1, player2) {
  this.mode = 0; // 0 end, 1 = start placing, 2 = normal play
  this.gamefield = gf;
  var player1 = player1;
  var player2 = player2 || new Player("CPU");
  var currentTurn = null;
  this.tokensPlaced = 0;


  this.start = function() {
    player1.initPlayer();
    player2.initPlayer();
    player2.cpu = 1;
    this.gamemode = 0;
    currentTurn = player1;
  }

  this.isHumansTurn = function() {
    //console.log(currentTurn);
    return currentTurn !== 'undefinied' && currentTurn === player1;
  }

  this.changeTurn = function() {
    currentTurn = currentTurn === player1 ? player2 : player1;
  }

  this.createToken = function(x,y,pos) {
      var token = new PlayerToken(currentTurn, x, y);
      token.vertexId = pos;
      var obj = this.convertVertexPosToArrayPos(pos);
      this.gamefield.field[obj.z][obj.y][obj.x] = token;
  }

//TODO: move this function
  this.convertVertexPosToArrayPos = function(pos) {
    var z = Math.floor(pos / 8);
    // empty field at x:2 y:2
    if(pos%8 > 3) {
      pos++;
    }
    var y = Math.floor(((pos) % 8) /3);
    var x = Math.floor(((pos) % 8) % 3);
    return {
      x:x,
      y:y,
      z:z
    }
  }

  this.start();

}
