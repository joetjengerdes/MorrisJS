function Player(playerName, color) {
    this.cpu = 0; // 0 for human, 1 for cpus
    this.playerName = playerName;
    this.token = [];
    this.color = "hsla(0, 100%, 50%, 1)";

    this.initPlayer = function() {
        this.token = [];
    }

}
