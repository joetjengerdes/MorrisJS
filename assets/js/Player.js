function Player(playerName, color) {
    this.cpu = 0; // 0 for human, 1 for cpus
    this.playerName = playerName;
    this.token = [];
    this.color = "#FF0000"

    this.initPlayer = function() {
        this.token = [];
    }

}
