function Game(p1, p2) {
  var mode = 1; // 0 end, 1 = start placing, 2 = normal play
  this.gamefield = null;
  var player1 = p1;
  var player2 = p2 || new Player("CPU");
  var currentTurn = null;
  var tokensPlaced = 0;
  const MAX_TOKEN_TO_PLACE = 18;

  /**
   * This function starts a new game, everything
   * is set to default. On a new game the starting
   * player will change. By first start player1
   * is selected as the starting player.
   */
  this.newGame = function() {
    player1.initPlayer();
    player2.initPlayer();
    player2.cpu = 1;
    player2.color = "#00FF00";
    this.gamemode = 0;
    this.gamefield = new GameField();
    if(currentTurn == null || currentTurn == player2) {
      currentTurn = player1;
    }
    else {
      currentTurn = player2;
    }
  }

  /**
   * This function returns if the current phase
   * of the game is the phase where players are
   * placing their tokens
   * @return {Boolean} true if it's the placing phase, otherwise false
   */
  this.isPlacingPhase = function() {
    return mode == 1;
  }

  /**
   * This function return if player1 is the next player
   * @return {Boolean} true if it's player1's turn, false if it's player2's
   */
  this.isPlayerOneTurn = function() {
    //console.log(currentTurn);
    return currentTurn !== 'undefinied' && currentTurn === player1;
  }

  /**
   * This function is called if a player ends his turn (and the next player
   * is able to play). If the current phase the placing phase, the tokensPlaced
   * count will count up to determine if the next phase of the game starts.
   */
  this.changeTurn = function() {
    if(mode == 1) {
      tokensPlaced++;
      if(tokensPlaced >= MAX_TOKEN_TO_PLACE) {
        mode = 2;
      }
    }
    currentTurn = currentTurn === player1 ? player2 : player1;
  }

  this.createToken = function(x,y,pos) {
      var token = new PlayerToken(currentTurn, x, y, currentTurn);
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
    var y = Math.floor(((pos) % 9) /3);
    var x = Math.floor(((pos) % 9) % 3);
    return {
      x:x,
      y:y,
      z:z
    }
  }

  this.newGame();

}
