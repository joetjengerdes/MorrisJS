/**
 * Gamecontroller is used to control the game
 * @param {Game} game  the game controlled by the controller
 */
function GameController(game, stbar) {
    // reference of the game
    var mGame = game;
    // self reference
    var mController = this;
    // refenrece of the event controller
    var mEventController = null;
    // refenrece of the drawController
    var mDrawController = null;
    // reference of the status bar
    var mGameStatusBar = stbar;

    /**
     * Gets the Game
     * @return {Game} the game
     */
    this.getGame = function() {
        return mGame;
    }

    /**
     * Sets the draw controller
     * @param {DrawController} drawController_ controller to set
     */
    this.setDrawController = function(drawController_) {
        mDrawController = drawController_;
    }

    /**
     * Gets the draw controller
     * @return {DrawController} the drawcontroller
     */
    this.getDrawController = function() {
        return mDrawController;
    }

    /**
     * Sets the event controller
     * @param {EventController} eventController sets the event controller
     */
    this.setEventController = function(eventController) {
        mEventController = eventController;
    }

    /**
     * Returns the eventcontroller
     * @return {EventController} the eventcontroller
     */
    this.getEventController = function() {
        return mEventController;
    }

    /**
     * This function is called if a persons clicks on
     * the canvas
     * @param  {Integer} x x coordinate of the click
     * @param  {Integer} y y cooridnate of the click
     */
    this.doAction = function(x, y) {
        // It's cpus turn
        if (!mGame.isPlayerOneTurn()) return;

        var selectedVertex = getVerticeIndexOfCoords(x, y);

        // nothing selected
        if (selectedVertex == -1) return;

        mGame.doAction(selectedVertex);
        mDrawController.redraw();
        if (!mGame.isPlayerOneTurn()) {
            mGameStatusBar.setText('It\'s CPU\'s turn!', 'doAction');
        }

        if (mGame.getError()) {
            mGameStatusBar.setText(mGame.getError(), 'error');
            return;
        }

        setTimeout(function() {

            mGame.doTurnCPU();
            mDrawController.redraw();



            if (mGame.isPlacingPhase()) {
                if (mGame.hasPlayerToRemoveToken()) {
                    //mGameStatusBar.setText('You have to remove a token!', 'doAction');
                } else {
                    mGameStatusBar.setText('It\'s your turn. Place a token!', 'doAction');
                }
            } else if (mGame.isNormalPhase()) {
                if (mGame.isTokenSelected()) {
                    mGameStatusBar.setText('Move the token or select another', 'doAction');
                }
            }
        }, 300);


    }

    /**
     * Gets the vertex id of the given coordinates,
     * if there is no vertex -1 is returned
     * @param  {Integer} x x coordinate
     * @param  {Integer} y y cooridnate
     * @return {Integer}   vertex id, or -1 if there is none
     */
    function getVerticeIndexOfCoords(x, y) {
        var vertices = mGame.getGamefield().getVertices();
        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].contains(x, y)) {
                return i;
            }
        }
        return -1;
    }

}
