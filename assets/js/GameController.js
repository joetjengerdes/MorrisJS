function GameController(game, stbar) {
    this.valid = false;
    this.game = game;
    var controller = this;
    var eventController = null;
    var drawController = null;
    // flag if a player selected a token
    var playerSelectedToken = null;

    var gameStatusBar = stbar;

    this.setDrawController = function(drawController_) {
        drawController = drawController_;
    }

    this.getDrawController = function() {
        return drawController;
    }

    this.setEventController = function(eventController) {
        this.eventController = eventController;
    }

    this.getEventController = function() {
        return eventController;
    }

    this.doAction = function(x, y) {
        if (game.removeFlag == 0) {
            if (game.isPlacingPhase()) {
                // it's the player1 turn, on human-cpu game this represents the
                // human player
                //console.log("Is placing PHASE: " + game.isPlacingPhase());

                gameStatusBar.setText("Place a stone!");

                if (game.isPlayerOneTurn()) {
                    var index = getVerticeIndexOfCoords(x, y);

                    if (index != -1 && !game.gameProblemSolver.isTokenOnField(index)) {
                        game.createToken(index, true);

                        if (game.removeFlag == 0) {
                            game.changeTurn();
                        }
                    }

                } else {
                    // do nothing: it's CPUs turn and user tried to do s.th.
                    // TODO: remove test
                    var vertices = game.gamefield.vertices;
                    for (var i = 0; i < vertices.length; i++) {
                        //var coord = game.convertVertexPosToArrayPos(i);
                        //console.log(coord);
                        if (!game.gameProblemSolver.isTokenOnField(i)) {
                            //console.log(game.gamefield.field[coord.z][coord.y][coord.x]);
                            game.createToken(i, true);
                            //drawController.drawVertex(vertices[i].x, vertices[i].y, "#00FF00");

                            if (game.removeFlag == 1) {
                                var vertices = game.gamefield.vertices;
                                for (var i = 0; i < vertices.length; i++) {
                                    if (game.gameProblemSolver.isTokenOnField(i) && game.removeToken(i)) {
                                        break;
                                    }
                                }
                            }
                            game.changeTurn();
                            break;
                        }
                    }
                }
            } else if (game.hasEnded()) {
                gameStatusBar.setText("Game ended!");
            } else { // gamemod: normal play
                gameStatusBar.setText("Select a token to move")
                var index = getVerticeIndexOfCoords(x, y);
                // select or reselect a token
                if (index != -1 && game.gameProblemSolver.isTokenOnField(index)) {
                    // player tried to select the enemies token
                    var token = getTokenOfField(index);
                    if (token.getPlayer() !== game.getCurrentPlayer()) return;
                    selectToken(token);
                }
                // player clicked on a free spot, so he wants to move the selected
                else {
                    // player did not select any token to move
                    if (!playerSelectedToken) return;

                    doMovement(x, y);
                    unselectAllOtherToken();
                }



                console.log("normal play");

                if (game.isPlayerOneTurn()) {
                    var index = getVerticeIndexOfCoords(x, y);
                    console.log(index);
                    if (index != -1 && game.gameProblemSolver.isTokenOnField(index)) {

                    }
                }
            }
        } else {
            gameStatusBar.setText("Remove a stone!");

            console.log("remove" + x + " " + y);
            var index = getVerticeIndexOfCoords(x, y);

            console.log(index);
            if (index != -1 && game.gameProblemSolver.isTokenOnField(index)) {
                console.log(index);
                if (game.removeToken(index)) {
                    console.log("REMOVE");
                    game.changeTurn();
                    gameStatusBar.setText("Token removed!");
                    //break;
                } else {
                    gameStatusBar.setText("You cannot remove your own token!");
                }
            } else {
                gameStatusBar.setText("There's no token on this field");
            }
        }
        drawController.redraw();
    }

    function getVerticeIndexOfCoords(x, y) {
        var vertices = game.gamefield.vertices;
        for (var i = 0; i < vertices.length; i++) {
            if (vertices[i].contains(x, y)) {
                return i;
            }
        }
        return -1;
    }

    function getTokenOfField(vertIndex) {
        var coord = game.convertVertexPosToArrayPos(vertIndex);
        return game.gamefield.field[coord.z][coord.y][coord.x];
    }

    function selectToken(token) {
        // a player had selected a token before, so all token needs to be set
        // to not selected again
        if (playerSelectedToken) {
            unselectAllOtherToken();
        }
        token.selected = true;
        playerSelectedToken = token;
    }

    function unselectAllOtherToken() {
        playerSelectedToken = null;
        for (var z = 0; z < 3; z++) {
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 3; x++) {
                    if (game.gamefield.field[z][y][x]) {
                        game.gamefield.field[z][y][x].selected = false;
                    }
                }
            }
        }
    }

    function doMovement(x, y) {
        game.moveToken(playerSelectedToken.vertexId,
            getVerticeIndexOfCoords(x, y));
    }
}
