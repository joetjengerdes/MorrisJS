/**
 * Player represents a player in the game, this
 * can be a human player or a computer controlled
 * player (CPU).
 * @param {String} playerName the name of the player
 */
function Player(playerName) {
    // flag if the player is a cpu or a human player
    var mCpu = false;
    // name of the player
    var mPlayerName = playerName;
    // the color of the tokens
    var mColor = "hsla(0, 100%, 50%, 1)";
    // the color if a stone is selected (highlighted)
    var mHighlightingColor = "hsla(0, 100%, 70%, 1)";
    // counter for the tokens the player currently has on the field
    var mTokenCount = 0;
    // reference of the game
    var mGame;

    /**
     * Returns the highlighted color
     * @return {String} the highlighting color
     */
    this.getHighlightingColor = function() {
        return mHighlightingColor;
    }

    /**
     * Sets the highlighting color
     * @param {String} c the highlighting color to be set
     */
    this.setHightlightingColor = function(c) {
        mHighlightingColor = c;
    }

    /**
     * Return the name of the player
     * @return {String} name of the player
     */
    this.getName = function() {
        return mPlayerName;
    }

    /**
     * Sets a new name
     * @param {String} newName new name for the player
     */
    this.setName = function(newName) {
        mPlayerName = newName;
        console.log(newName);
    }

    /**
     * Resets the count of the tokens for the player to zero
     */
    this.resetTokenCount = function() {
        mTokenCount = 0;
    }

    /**
     * Return true if the player is a cpu
     * @return {Boolean} true if cpu, false if human
     */
    this.isCPU = function() {
        return mCpu;
    }

    /** Sets the player to be a cpu controlled player */
    this.setCpu = function() {
        mCpu = true;
    }

    /**
     * Sets the color of the player
     * @param {String} color of the tokens
     */
    this.setColor = function(color) {
        mColor = color;
    }

    /**
     * Return the color of the player tokens
     * @return {String} the color of the player tokens
     */
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
