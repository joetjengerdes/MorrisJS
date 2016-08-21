function ArtificialIntelligenceService(game) {
    var game = game;
    var moves = [];
    var field = game.gamefield.clone().field;

    function evaluate() {
        // TODO: 
    }


    /**
     * initMoves - Create a list with the possible moves.
     *
     * @return {Array}  list with moves
     */
    function initMoves() {

        var gamefield = game.gamefield;
        if (game.isPlacingPhase()) {
            var vertices = gamefield.vertices;
            var problemSolver = game.gameProblemSolver;
            for (var z; z < vertices.length; z++) {
                if (problemSolver.isTokenOnField(z)) {
                    var obj = game.convertVertexPosToArrayPos(z);
                    move.push({
                        src: null,
                        dst: obj
                    }); // TODO: geht es so ??
                }
            }
        } else {
            for (var z = 0; z < field.length; z++) {
                for (var y = 0; y < field[0].length; y++) {
                    for (var x = 0; x < field[0][0].length; x++) {
                        var token = field[z][y][x];
                        if (token && (token.getPlayer() === game.currentTurn)) {
                            if (problemSolver.canMoveUp(z, y, x)) {
                                moves.push({
                                    src: {
                                        x: x,
                                        y: y,
                                        z: z
                                    },
                                    dst: {
                                        x: x,
                                        y: y - 1,
                                        z: z
                                    }
                                });
                            }
                            if (problemSolver.canMoveDown(z, y, x)) {
                                moves.push({
                                    src: {
                                        x: x,
                                        y: y,
                                        z: z
                                    },
                                    dst: {
                                        x: x,
                                        y: y + 1,
                                        z: z
                                    }
                                });
                            }
                            if (problemSolver.canMoveRight(z, y, x)) {
                                moves.push({
                                    src: {
                                        x: x,
                                        y: y,
                                        z: z
                                    },
                                    dst: {
                                        x: x + 1,
                                        y: y,
                                        z: z
                                    }
                                });
                            }
                            if (problemSolver.canMoveLeft(z, y, x)) {
                                moves.push({
                                    src: {
                                        x: x,
                                        y: y,
                                        z: z
                                    },
                                    dst: {
                                        x: x + 1,
                                        y: y,
                                        z: z
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    function doNextMove(move) {
        if (move.src) {
            field[move.src.z][move.src.y][move.src.x] = null;
        }
        if (move.dst) {
            // is not visible. x,y is not neccessary
            var token = new PlayerToken(game.currentTurn, null, null, game.currentTurn);
            field[move.dst.z][move.dst.y][move.dst.x] = token;
        }
    }

    function undoMove(move) {
        if (mpve.src) {
            // is not visible. x,y is not neccessary
            var token = new PlayerToken(game.currentTurn, null, null, game.currentTurn);
            field[move.src.z][move.src.y][move.src.x] = token;
        }
        if (move.dst) {
            field[move.dst.z][move.dst.y][move.dst.x] = null;
        }
    }

    function alphaBeta(deep, alpha, beta) {
        if (deep == 0)
            return evaluate();

        var PVfound = false;
        var max = Number.MIN_VALUE;
        initMoves();
        while (moves.length > 0) {
            var currentMove = move.pop();
            doNextMove(currentMove);
            if (PVfound) {
                var val = -alphaBeta(deep - 1, -alpha - 1, -alpha);
                if (val > alpha && val < beta)
                    val = -alphaBeta(deep - 1, -beta, -val);
            } else
                val = -alphaBeta(deep - 1, -beta, -alpha);
            undoMove(currentMove);
            if (val > max) {
                if (val >= beta)
                    return val;
                max = val;
                if (val > alpha) {
                    alpha = val;
                    PVfound = TRUE;
                }
            }
        }
        return max;
    }
}
