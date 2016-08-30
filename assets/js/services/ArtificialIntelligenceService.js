function ArtificialIntelligenceService(game) {
    var mGame = game;
    var mMoves = [];
    var mField = mGame.getGamefield().cloneField();
    var mDepth = 5;
    var mBestMove;
    var mCurrentPlayer; // is neccessary because we are simulating the turns

    //TODO: PROBLEM: welcher SPIELER ist an der reihe

    /**
     * evaluate - ... the current gamefield and return a "score". this score indicates
     * wheter the current situation is good or bad. The higher the better.
     *
     * @return {int}  value describes the situation
     */
    function evaluate() {
        var result = 0;
        var gameProblemSolver = mGame.getGameProblemSolver();

        var numberOfTokenCurrentPlayer = gameProblemSolver.getNumberOfToken(mGame.getCurrentPlayer());
        var numberOfTokenOpponentPlayer = gameProblemSolver.getNumberOfToken(mGame.getOpponentPlayer());

        /**
         * weight:
         * 3 Token: 0.00
         * 4 Token: 0.10
         * 5 Token: 0.15
         * and so on
         */
        var numberOfTokenWeight = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        // minToken = 3, maxToken = 9; 3 token represents the first index.
        result += numberOfTokenWeight[numberOfTokenCurrentPlayer - 3];
        // for the opponent
        result -= numberOfTokenWeight[numberOfTokenOpponentPlayer - 3];

        /**
         * number of moves
         */
        var numberOfMovesWeight = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30]
        var numberOfMovesCurrentPlayer = gameProblemSolver.numberOfMoves(mGame.getCurrentPlayer(), mField);
        var numberOfMovesOpponentPlayer = gameProblemSolver.numberOfMoves(mGame.getOpponentPlayer(), mField);

        /**
         * if the number of the current player is larger than 10, the index is 5.
         * else the index is floor of numberOfMoves/2
         */
        if (numberOfMovesCurrentPlayer >= 10) {
            result += numberOfMovesWeight[5];
        } else {
            result += numberOfMovesWeight[Math.floor(numberOfMovesCurrentPlayer / 2)];
        }
        // for the opponent
        if (numberOfMovesOpponentPlayer >= 10) {
            result -= numberOfMovesWeight[5];
        } else {
            result -= numberOfMovesWeight[Math.floor(numberOfMovesOpponentPlayer / 2)];
        }


        /**
         * evaluate the number of morris of each player
         */
        var numberOfMorrisWeight = [0.00, 0.01, 0.02];
        var numberOfMorrisCurrentPlayer = gameProblemSolver.numberOfMorris(mGame.getCurrentPlayer());
        var numberOfMorrisOpponentPlayer = gameProblemSolver.numberOfMorris(mGame.getOpponentPlayer());

        if (numberOfMorrisCurrentPlayer >= 2) {
            result += numberOfMorrisWeight[2];
        } else {
            result += numberOfMorrisWeight[numberOfMorrisCurrentPlayer];
        }
        // for the opponent
        if (numberOfMorrisOpponentPlayer >= 2) {
            result -= numberOfMorrisWeight[2];
        } else {
            result -= numberOfMorrisWeight[numberOfMorrisOpponentPlayer];
        }


        /**
         * evaluate the number of morris which are opened. this is important
         * because the player can remove a token at his next turn.
         */
        var numberOfOpenMorrisWeight = [0.00, 0.02, .04];
        var numberOfOpenMorrisCurrentPlayer = gameProblemSolver.numberOfOpenMorris(mGame.getCurrentPlayer());
        var numberOfOpenMorrisOpponentPlayer = gameProblemSolver.numberOfOpenMorris(mGame.getOpponentPlayer());

        if (numberOfOpenMorrisCurrentPlayer >= 2) {
            result += numberOfOpenMorrisWeight[2];
        } else {
            result += numberOfOpenMorrisWeight[numberOfOpenMorrisCurrentPlayer];
        }
        // for the opponent
        if (numberOfOpenMorrisOpponentPlayer >= 2) {
            result -= numberOfOpenMorrisWeight[2];
        } else {
            result -= numberOfOpenMorrisWeight[numberOfOpenMorrisOpponentPlayer];
        }

        var numberOfPossibleMovesWeight = [0.00, 0.02, 0.04, 0.08, 0.16];
        var numberOfPossibleMovesCurrentPlayer = gameProblemSolver.numberOfPossibleMoves(mGame.getCurrentPlayer());
        var numberOfPossibleMovesOpponentPlayer = gameProblemSolver.numberOfPossibleMoves(mGame.getOpponentPlayer());

        // calculate which player has more possibilitys
        var difference = numberOfPossibleMovesCurrentPlayer - numberOfPossibleMovesOpponentPlayer;

        // check the sign of the difference
        var sign = difference > 0 ? 1 : (-1);

        // difference is more than 7
        if ((difference * sign) >= 7) {
            result += numberOfPossibleMovesWeight[4] * sign;
        } else if ((difference * sign) >= 4) {
            result += numberOfPossibleMovesWeight[3] * sign;
        } else if ((difference * sign) >= 2) {
            result += numberOfPossibleMovesWeight[2] * sign;
        } else if ((difference * sign) >= 1) {
            result += numberOfPossibleMovesWeight[1] * sign;
        }
        return result;
    }


    /**
     * initMoves - Create a list with the possible moves.
     *
     * @return {Array}  list with moves
     */
    function initMoves() {
        var problemSolver = mGame.getGameProblemSolver();
        var gamefield = mGame.getGamefield();
        if (mGame.isPlacingPhase()) {
            var vertices = gamefield.getVertices();
            for (var z = 0; z < vertices.length; z++) {
                if (problemSolver.isTokenOnField(z)) {
                    var obj = mGame.convertVertexPosToArrayPos(z);
                    mMoves.push({
                        src: null,
                        dst: obj
                    }); // TODO: WELCHER SPILER FEHLT
                }
            }
        } else {
            for (var z = 0; z < mField.length; z++) {
                for (var y = 0; y < mField[0].length; y++) {
                    for (var x = 0; x < mField[0][0].length; x++) {
                        var token = mField[z][y][x];
                        if (token && (token.getPlayer() === mGame.getCurrentPlayer())) {
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


    /**
     * doNextMove - simulate the next move.
     *
     * @param  {obj} move obj with coordinates.
     */
    function doNextMove(move) {
        if (move.src) {
            mField[move.src.z][move.src.y][move.src.x] = null;
        }
        if (move.dst) {
            // is not visible. x,y is not neccessary
            var token = new PlayerToken(mGame.getCurrentPlayer());
            mField[move.dst.z][move.dst.y][move.dst.x] = token;
        }
    }


    /**
     * undoMove - undo the simulated move.
     *
     * @param  {obj} move object with coordinates.
     */
    function undoMove(move) {
        if (move.src) {
            // is not visible. x,y is not neccessary
            var token = new PlayerToken(mGame.getCurrentPlayer());
            mField[move.src.z][move.src.y][move.src.x] = token;
        }
        if (move.dst) {
            mField[move.dst.z][move.dst.y][move.dst.x] = null;
        }
    }

    function alphaBeta(depth, alpha, beta) {
        if (depth == 0) {
            return evaluate();
        }

        var PVfound = false;
        var max = Number.NEGATIVE_INFINITY;
        initMoves();
        while (mMoves.length > 0) {
            var currentMove = mMoves.pop();
            doNextMove(currentMove);
            if (PVfound) {
                var val = -alphaBeta(depth - 1, -alpha - 1, -alpha);
                if (val > alpha && val < beta)
                    val = -alphaBeta(depth - 1, -beta, -val);
            } else
                val = -alphaBeta(depth - 1, -beta, -alpha);
            undoMove(currentMove);
            if (val > max) {
                if (val >= beta)
                    return val;
                max = val;
                mBestMove = currentMove;
                if (val > alpha) {
                    alpha = val;
                    PVfound = true;
                }
            }
        }
        return max;
    }

    this.getBestMove = function(gameField) {
        mField = gameField.cloneField();
        mCurrentPlayer = mGame.getCurrentPlayer();
        var val = alphaBeta(mDepth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        console.log("VAL: " + val);
        return mBestMove;
    }
}
