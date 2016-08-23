function Player(playerName) {
    var mCpu = 0; // 0 for human, 1 for cpus
    var mPlayerName = playerName;
    var mColor = "hsla(0, 100%, 50%, 1)";
    // counter for the tokens the player currently has on the field
    var mTokenCount = 0;
    var mGame;

    this.getName = function() {
        return mPlayerName;
    }

    this.resetTokenCount = function() {
        mTokenCount = 0;
    }

    this.getPlayerName = function() {
        return mPlayerName;
    }

    this.isCPU = function() {
        return mCpu == 1;
    }

    this.setCpu = function() {
        mCpu = 1;
    }

    this.setColor = function(color) {
        mColor = color;
    }

    this.getColor = function() {
        return mColor;
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
