function Player(playerName, game) {
  this.cpu = 0; // 0 for human, 1 for cpus
  this.playerName = playerName;
  this.token = [];

  this.initPlayer = function() {
    this.token = [];
  }
}
