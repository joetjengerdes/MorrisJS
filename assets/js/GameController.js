function GameController(game, stbar) {
    var mGame = game;
    var mController = this;
    var mEventController = null;
    var mDrawController = null;
    // flag if a player selected a token
    var mSelectedPlayerToken = null;
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
        if (mGame.getRemoveFlag() == 0) {
            if (mGame.isPlacingPhase()) {
                // it's the player1 turn, on human-cpu mGame this represents the
                // human player
                //console.log("Is placing PHASE: " + mGame.isPlacingPhase());

                mGameStatusBar.setText("Place a stone!");

                if (mGame.isPlayerOneTurn()) {
                    var index = getVerticeIndexOfCoords(x, y);

                    if (index != -1 && !mGame.getGameProblemSolver().isTokenOnField(index)) {
                        mGame.createToken(index, true);

                        if (mGame.getRemoveFlag() == 0) {
                            mGame.changeTurn();
                            doTurnCPU();
                        }
                    }


                }
            } else if (mGame.hasEnded()) {
                mGameStatusBar.setText("Game ended!");
            } else { // mGamemod: normal play
                mGameStatusBar.setText("Select a token to move")
                var index = getVerticeIndexOfCoords(x, y);
                // select or reselect a token
                if (index != -1 && mGame.getGameProblemSolver().isTokenOnField(index)) {
                    // player tried to select the enemies token
                    var token = getTokenOfField(index);
                    if (token.getPlayer() !== mGame.getCurrentPlayer()) return;
                    selectToken(token);
                }
                // player clicked on a free spot, so he wants to move the selected
                else {
                    // player did not select any token to move
                    if (!mSelectedPlayerToken) return;

                    console.log("move!");
                    doMovement(x, y);
                    unselectAllOtherToken();
                    doTurnCPU();
                }

            }
        } else {
            mGameStatusBar.setText("Remove a stone!");

            console.log("remove" + x + " " + y);
            var index = getVerticeIndexOfCoords(x, y);

            console.log(index);
            if (index != -1 && mGame.getGameProblemSolver().isTokenOnField(index)) {
                console.log(index);
                if (mGame.removeToken(index)) {
                    mGameStatusBar.setText("Token removed!");
                    doTurnCPU();
                    //break;
                } else {
                    mGameStatusBar.setText("You cannot remove your own token!");
                }
            } else {
                mGameStatusBar.setText("There's no token on this field");
            }
        }
        mDrawController.redraw();
    }

    function doTurnCPU() {
        setTimeout(function() {
            // do nothing: it's CPUs turn and user tried to do s.th.
            // TODO: remove test
            if (mGame.isPlacingPhase()) {
                var vertices = mGame.getGamefield().getVertices();
                for (var i = 0; i < vertices.length; i++) {
                    //var coord = mGame.convertVertexPosToArrayPos(i);
                    //console.log(coord);
                    if (!mGame.getGameProblemSolver().isTokenOnField(i)) {
                        //console.log(mGame.getGamefield().field[coord.z][coord.y][coord.x]);
                        mGame.createToken(i, true);
                        //drawController.drawVertex(vertices[i].x, vertices[i].y, "#00FF00");

                        if (mGame.getRemoveFlag() == 1) {
                            var vertices = mGame.getGamefield().getVertices();
                            for (var i = 0; i < vertices.length; i++) {
                                if (mGame.getGameProblemSolver().isTokenOnField(i) && mGame.removeToken(i)) {
                                    break;
                                }
                            }
                            return;
                        }
                        mGame.changeTurn();
                        break;
                    }
                }
            } else {
                var vertices = mGame.getGamefield().getVertices();
                var gameProblemSolver = mGame.getGameProblemSolver();
                for (var i = 0; i < vertices.length; i++) {
                    var moves = gameProblemSolver.getPossibleMoves(i);
                    if (moves.length > 0) {
                        console.log("AUFRUG MOVE CPU");
                        mGame.moveToken(i, moves[0]);
                        break;
                    }
                }
            }
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

    function getTokenOfField(vertIndex) {
        var coord = mGame.convertVertexPosToArrayPos(vertIndex);
        return mGame.getGamefield().getField()[coord.z][coord.y][coord.x];
    }

    function selectToken(token) {
        // a player had selected a token before, so all token needs to be set
        // to not selected again
        if (mSelectedPlayerToken) {
            unselectAllOtherToken();
        }
        token.select();
        mSelectedPlayerToken = token;
    }

    function unselectAllOtherToken() {
        mSelectedPlayerToken = null;
        for (var z = 0; z < 3; z++) {
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 3; x++) {
                    if (mGame.getGamefield().getField()[z][y][x]) {
                        mGame.getGamefield().getField()[z][y][x].unselect();
                    }
                }
            }
        }
    }

    function doMovement(x, y) {
        mGame.moveToken(mSelectedPlayerToken.getVertexIndex(),
            getVerticeIndexOfCoords(x, y));
    }
}
