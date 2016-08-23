function ArtificialIntelligenceService(game) {
    var mGame = game;
    var mMoves = [];
    var mField = mGame.getGamefield().cloneField();

    function evaluate() {
        // TODO:
    }


    /**
     * initMoves - Create a list with the possible moves.
     *
     * @return {Array}  list with moves
     */
    function initMoves() {

        var gamefield = mGame.getGamefield();
        if (mGame.isPlacingPhase()) {
            var vertices = gamefield.getVertices();
            var problemSolver = mGame.getGameProblemSolver();
            for (var z; z < vertices.length; z++) {
                if (problemSolver.isTokenOnField(z)) {
                    var obj = mGame.convertVertexPosToArrayPos(z);
                    move.push({
                        src: null,
                        dst: obj
                    }); // TODO: geht es so ??
                }
            }
        } else {
            for (var z = 0; z < mField.length; z++) {
                for (var y = 0; y < mField[0].length; y++) {
                    for (var x = 0; x < mField[0][0].length; x++) {
                        var token = mField[z][y][x];
                        if (token && (token.getPlayer() === mGame.getCurrentTurn())) {
                            if (problemSolver.canMoveUp(z, y, x)) {
                                mMoves.push({
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
                                mMoves.push({
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
                                mMoves.push({
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
                                mMoves.push({
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
            mField[move.src.z][move.src.y][move.src.x] = null;
        }
        if (move.dst) {
            // is not visible. x,y is not neccessary
            var token = new PlayerToken(mGame.getCurrentTurn(), null, null, mGame.getCurrentTurn());
            mField[move.dst.z][move.dst.y][move.dst.x] = token;
        }
    }

    function undoMove(move) {
        if (move.src) {
            // is not visible. x,y is not neccessary
            var token = new PlayerToken(mGame.getCurrentTurn(), null, null, mGame.getCurrentTurn());
            mField[move.src.z][move.src.y][move.src.x] = token;
        }
        if (move.dst) {
            mField[move.dst.z][move.dst.y][move.dst.x] = null;
        }
    }

    function alphaBeta(deep, alpha, beta) {
        if (deep == 0)
            return evaluate();

        var PVfound = false;
        var max = Number.MIN_VALUE;
        initMoves();
        while (mMoves.length > 0) {
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
