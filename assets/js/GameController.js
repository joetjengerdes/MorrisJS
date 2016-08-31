/**
 * Gamecontroller is used to control the game
 * @param {Game} game  the game controlled by the controller
 */
function GameController(game) {
    // reference of the game
    var mGame = game;
    var mController = this;
    var mEventController = null;
    var mDrawController = null;

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

        setTimeout(function() {
            mGame.doTurnCPU();
            mDrawController.redraw();
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
