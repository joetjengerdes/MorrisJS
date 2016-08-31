/**
 * Gamecontroller is used to control the game
 * @param {Game} game  the game controlled by the controller
 */
function GameController(game, stbar) {
    // reference of the game
    var mGame = game;
    var mController = this;
    var mEventController = null;
    var mDrawController = null;
    var mGameStatusBar = stbar;

    this.getGame = function() {
        return mGame;
    }

    this.setDrawController = function(drawController_) {
        mDrawController = drawController_;
    }

    this.getDrawController = function() {
        return mDrawController;
    }

    this.setEventController = function(eventController) {
        mEventController = eventController;
    }

    this.getEventController = function() {
        return mEventController;
    }

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

        setTimeout(function() {

            mGame.doTurnCPU();
            mDrawController.redraw();

            if (mGame.isPlacingPhase()) {
                if (mGame.hasPlayerToRemoveToken()) {
                    mGameStatusBar.setText('You have to remove a token!', 'doAction');
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
