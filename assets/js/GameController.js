function GameController(game) {
    this.valid = false;
    this.game = game;
    var controller = this;
    var eventController = null;
    var drawController = null;

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
                console.log("Is placing PHASE: " + game.isPlacingPhase());
                if (game.isPlayerOneTurn()) {
                    var index = getVerticeIndexOfCoords(x, y);

                    if (index != -1 && !game.gameProblemSolver.isTokenOnField(index)) {
                        game.createToken(game.gamefield.vertices[index].x,
                            game.gamefield.vertices[index].y, index);
                        drawController.redraw();

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
                            game.createToken(vertices[i].x, vertices[i].y, i);
                            drawController.drawVertex(vertices[i].x, vertices[i].y, "#00FF00");

                            if (game.removeFlag == 1) {
                                var vertices = game.gamefield.vertices;
                                for (var i = 0; i < vertices.length; i++) {
                                    if (game.gameProblemSolver.isTokenOnField(i) && game.removeToken(i)) {
                                        drawController.redraw();
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

            } else { // gamemod: normal play
                console.log("normal play");
                if (game.isPlayerOneTurn()) {
                    var index = getVerticeIndexOfCoords(x, y);
                    if (index != -1 && game.gameProblemSolver.isTokenOnField(index)) {
                        token.selected = true;
                    }
                }
            }
        } else {
            console.log("remove" + x + " " + y);
            var index = getVerticeIndexOfCoords(x, y);
            console.log(index);
            if (index != -1 && game.gameProblemSolver.isTokenOnField(index)) {
                console.log(index);
                if (game.removeToken(index)) {
                    console.log("REMOVE");
                    game.changeTurn();
                    drawController.redraw();
                    //break;
                }
            }
        }
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
}
