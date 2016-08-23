function Player(playerName, color) {
    this.cpu = 0; // 0 for human, 1 for cpus
    this.playerName = playerName;
    this.token = [];
    this.color = "hsla(0, 100%, 50%, 1)";
    // counter for the tokens the player currently has on the field
    var mTokenCount = 0;
    var mGame;

    /**
     * Initializes the player for a new game
     */
    this.initPlayer = function() {
        this.token = [];
    }

    /**
     * Sets the game the to player where he participates
     * @param {Game} game game where to participate
     */
    this.setGame = function(game) {
        mGame = game;
    }

    /**
     * Called when a player places a token
     */
    this.placeToken = function() {
        mTokenCount++;
    }

    /**
     * Called when a player lost a token (stolen from the other place)
     */
    this.lostToken = function() {
        mTokenCount--;
    }

    /**
     * Return true, if the player only has 3 tokens left, so he can jump
     * with them.
     * @return {Boolean} true, if he can jump, otherwise false
     */
    this.canJump = function() {
        return mTokenCount == 3 && !mGame.isPlacingPhase();
    }

    /**
     * Return true, if the player has lost the game. If the game is still
     * running or he won, this function will return false.
     * @return {Boolean} true if game lost, false if game running or he won
     */
    this.hasLost = function() {
        return mTokenCount < 3 && !mGame.isPlacingPhase();
    }

}
