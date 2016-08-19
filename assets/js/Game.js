function Game(gamefield, player1, player2) {
  this.mode = 0; // 0 end, 1 = start placing, 2 = normal play
  this.gamefield = gamefield;
  var player1 = player1;
  var player2 = player2 || new Player("CPU");
  var currentTurn = null;


  this.start = function() {
    player1.initPlayer();
    player2.initPlayer();
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
      var z = Math.floor(pos / 8);
      var y = Math.floor(((pos+1) % 8) /3);
      var x = Math.floor(((pos+1) % 8) % 3);
      console.log("arrayField x y z:" + x + " "+ y + " " +z);

    //  gamefield.field[x][y][z] =
  }

  this.start();

}
