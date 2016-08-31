/**
 * Playertoken is a token (or a stone) of a player
 * @param {Player} p player the token belongs to
 */
function PlayerToken(p) {
    // the owner of the token
    var mPlayer = p;
    // the vertex id of the token, vertex id is
    // the array position in the gamefields vertices
    var mVertexId = -1;
    // a flag if the current token is selected or not
    // selected tokens should be highlighted
    var mSelected = false;

    /**
     * Return the color of the token
     * @return {String} color of the token
     */
    this.getColor = function() {
        return mPlayer.getColor();
    };

    /**
     * Return the owner of the token
     * @return {Player} the owner of the token
     */
    this.getPlayer = function() {
        return mPlayer;
    };

    /**
     * Returns whether the token is selected or not
     * @return {Boolean} true if selected, false otherwise
     */
    this.isSelected = function() {
        return mSelected;
    };

    /**
     * Selects the token
     */
    this.select = function() {
        mSelected = true;
    };

    /**
     * Unselects the token
     */
    this.unselect = function() {
        mSelected = false;
    };

    /**
     * Get the vertex id of the token
     * @return {Integer} the id of the vertex the token is on top
     */
    this.getVertexIndex = function() {
        return mVertexId;
    };

    /**
     * Sets the vertex id
     * @param {Integer} vertexIndex the id of the vertex the token is on top
     */
    this.setVertexIndex = function(vertexIndex) {
        mVertexId = vertexIndex;
    };
}
