function Game(player1) {
  this.mode = 0; // 0 end, 1 = start placing, 2 = normal play
  this.player1 = player1;
  var player2 = new Player("CPU");
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

  this.start();

}
