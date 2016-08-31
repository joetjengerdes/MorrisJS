/**
 * ArtificialIntelligenceService - class for searching the best move.
 *
 * @param  {Game} game game with all informations.
 */
function ArtificialIntelligenceService(game) {
    var mGame = game;
    var mField = mGame.getGamefield().cloneField();
    var mDepth = 4;
    var mBestMove;
    var mCurrentPlayer; // is neccessary because we are simulating the turns
    var mCounterTokenPlaced = 0; // neccessary for checking the end of the placing phase.


    /**
     * setDepth - set the depth. the higher the better for the move searching.
     *
     * @param  {type} value description
     * @return {type}       description
     */
    this.setDepth = function(value) {
        mDepth = value;
    }

    /**
     * getOtherPlayer - get the opponent of the current player.
     *
     * @return {Player}  other player
     */
    function getOtherPlayer() {
        // mGame.getCurrentPlayer() does not change. We just use the function
        // to get the players in this simulation.
        return (mCurrentPlayer === mGame.getCurrentPlayer()) ?
            mGame.getOpponentPlayer() : mGame.getCurrentPlayer();
    }

    /**
     * changePlayer - change the player for the simulation.
     */
    function changePlayer() {
        mCurrentPlayer = getOtherPlayer();
    }


    /**
     * evaluate - ... the current gamefield and return a "score". this score indicates
     * wheter the current situation is good or bad. The higher the better.
     *
     * @return {int}  value describes the situation
     */
    function evaluate() {
        var result = 0;
        var gameProblemSolver = mGame.getGameProblemSolver();
        var opponentPlayer = getOtherPlayer();

        var numberOfTokenCurrentPlayer = gameProblemSolver.numberOfToken(mCurrentPlayer, mField);
        var numberOfTokenOpponentPlayer = gameProblemSolver.numberOfToken(opponentPlayer, mField);

        /**

         * weight:
         * 3 Token: 0.00
         * 4 Token: 0.10
         * 5 Token: 0.15
         * and so on
         */
        var numberOfTokenWeight = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];
        // minToken = 3, maxToken = 9; 3 token represents the first index.
        if (numberOfTokenCurrentPlayer >= 3) {
            result += numberOfTokenWeight[numberOfTokenCurrentPlayer - 3];
        }
        // for the opponent
        if (numberOfTokenOpponentPlayer >= 3) {
            result -= numberOfTokenWeight[numberOfTokenOpponentPlayer - 3];
        }

        /**
         * number of moves
         */
        var numberOfMovesWeight = [0.00, 0.10, 0.15, 0.20, 0.25, 0.30]
        var numberOfMovesCurrentPlayer = gameProblemSolver.numberOfMoves(mCurrentPlayer, mField);
        var numberOfMovesOpponentPlayer = gameProblemSolver.numberOfMoves(opponentPlayer, mField);

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
        var numberOfMorrisWeight = [0.00, 1, 2];
        //var numberOfMorrisWeight = [0.00, 0.01, 0.02];
        var numberOfMorrisCurrentPlayer = gameProblemSolver.numberOfMorris(mCurrentPlayer, mField);
        var numberOfMorrisOpponentPlayer = gameProblemSolver.numberOfMorris(opponentPlayer, mField);

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
        var numberOfOpenMorrisWeight = [0.00, 0.02, 0.04];
        var numberOfOpenMorrisCurrentPlayer = gameProblemSolver.numberOfOpenMorris(mCurrentPlayer, mField);
        var numberOfOpenMorrisOpponentPlayer = gameProblemSolver.numberOfOpenMorris(opponentPlayer, mField);

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
        var numberOfPossibleMovesCurrentPlayer = gameProblemSolver.numberOfPossibleMoves(mCurrentPlayer,
            mGame.getGamefield().cloneField(mField));
        var numberOfPossibleMovesOpponentPlayer = gameProblemSolver.numberOfPossibleMoves(opponentPlayer,
            mGame.getGamefield().cloneField(mField));

        // calculate which player has more possibilitys
        var difference = numberOfPossibleMovesCurrentPlayer - numberOfPossibleMovesOpponentPlayer;

        // check the sign of the difference
        var sign = difference >= 0 ? 1 : (-1);

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
     * causeMorris - this function helps to simulate the next move and checks
     * if this move causes a Morris.
     *
     * @param  {obj} destination coordinates for the next move
     * @return {Boolean}  true if the move cause a Morris.
     */
    function causeMorris(destination) {
        var token = new PlayerToken(mCurrentPlayer);
        var result = false;
        mField[destination.z][destination.y][destination.x] = token;
        if (mGame.getGameProblemSolver().hasMorrisAtCoords(destination, mField)) {
            result = true;
        }
        mField[destination.z][destination.y][destination.x] = null;
        return result;
    }

    /**
     * addMoves - creates the list for the move for given by parameter. check the case if a
     * move makes a morris and create a moves for every token the opponent owns.
     * it is neccessary to evaluate and remove the best token.
     *
     * @param  {obj} source  coords of the source positino
     * @param  {obj} destination coords of the destination position
     * @return {[obj]} list with moves
     */

    function addMoves(source, destination) {
        var moves = [];
        if (destination) {
            if (causeMorris(destination)) {
                // add a move for every token that can be removed
                for (var z = 0; z < mField.length; z++) {
                    for (var y = 0; y < mField[0].length; y++) {
                        for (var x = 0; x < mField[0][0].length; x++) {
                            var token = mField[z][y][x];
                            if (token && (token.getPlayer() === getOtherPlayer())) {
                                // rm: {} is the remove token
                                moves.push({
                                    src: source,
                                    dst: destination,
                                    rm: {
                                        x: x,
                                        y: y,
                                        z: z
                                    }
                                });
                            }
                        }
                    }
                }
            } else {
                moves.push({
                    src: source,
                    dst: destination
                });
            }
        }
        return moves;
    }


    /**
     * initMoves - Create a list with the possible moves.
     *
     * @return {Array}  list with moves
     */
    function initMoves() {
        var problemSolver = mGame.getGameProblemSolver();
        var gamefield = mGame.getGamefield();
        var moves = [];

        for (var z = 0; z < mField.length; z++) {
            for (var y = 0; y < mField[0].length; y++) {
                for (var x = 0; x < mField[0][0].length; x++) {
                    // this field is not used
                    if (x == 1 && y == 1) {
                        continue;
                    }
                    var token = mField[z][y][x];
                    if (!token && mGame.isPlacingPhase()) {
                        var destination = {
                            x: x,
                            y: y,
                            z: z
                        }
                        moves = moves.concat(addMoves(null, destination));
                    } else {
                        if (token && (token.getPlayer() === mCurrentPlayer)) {
                            var source = {
                                    x: x,
                                    y: y,
                                    z: z
                                }
                                // can jump everywhere
                            var numberOfToken = problemSolver.getNumberOfToken(mCurrentPlayer, mField);
                            if (numberOfToken == 3) {
                                for (var zj = 0; zj < mField.length; zj++) {
                                    for (var yj = 0; yj < mField[0].length; yj++) {
                                        for (var xj = 0; xj < mField[0][0].length; xj++) {
                                            // this field is not used
                                            if (xj == 1 && yj == 1) {
                                                continue;
                                            }
                                            var token = mField[zj][yj][xj];
                                            if (!token) {
                                                var destination = {
                                                    x: xj,
                                                    y: yj,
                                                    z: zj
                                                }
                                                moves = moves.concat(addMoves(source, destination));
                                            }
                                        }
                                    }
                                }
                            } else {
                                var upCords = problemSolver.getMoveUpCoords(z, y, x, mField)
                                moves = moves.concat(addMoves(source, upCords));

                                var downCords = problemSolver.getMoveDownCoords(z, y, x, mField)
                                moves = moves.concat(addMoves(source, downCords));

                                var rightCords = problemSolver.getMoveRightCoords(z, y, x, mField)
                                moves = moves.concat(addMoves(source, rightCords));

                                var leftCords = problemSolver.getMoveLeftCoords(z, y, x, mField)
                                moves = moves.concat(addMoves(source, leftCords));
                            }

                        }
                    }
                }
            }
        }

        return moves;
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
            var token = new PlayerToken(mCurrentPlayer);
            mField[move.dst.z][move.dst.y][move.dst.x] = token;
            if (mGame.isPlacingPhase()) {
                mCounterTokenPlaced++;
            }
        }
        if (move.rm) {
            mField[move.rm.z][move.rm.y][move.rm.x] = null;
        }
        changePlayer();
    }


    /**
     * undoMove - undo the simulated move.
     *
     * @param  {obj} move object with coordinates.
     */
    function undoMove(move) {
        changePlayer();
        if (move.src) {
            var token = new PlayerToken(mCurrentPlayer);
            mField[move.src.z][move.src.y][move.src.x] = token;
        }
        if (move.dst) {
            mField[move.dst.z][move.dst.y][move.dst.x] = null;
            if (mGame.isPlacingPhase()) {
                mCounterTokenPlaced--;
            }
        }
        if (move.rm) {
            var token = new PlayerToken(getOtherPlayer());
            mField[move.rm.z][move.rm.y][move.rm.x] = token;
        }
    }


    /**
     * alphaBeta - we use alpha beta pruning to get the best move.
     *
     * @param  {int} depth depth to search
     * @param  {int} alpha alpha
     * @param  {int} beta  beta value
     * @return {int}       returns the max value
     */
    function alphaBeta(depth, alpha, beta) {
        if (depth == 0 || (mGame.isPlacingPhase() && (mGame.getNumberTokenPlaced() + mCounterTokenPlaced) == 18)) {
            return evaluate();
        }

        var PVfound = false;
        var max = Number.NEGATIVE_INFINITY;
        //var max = alpha;
        var moves = initMoves();
        while (moves.length > 0) {
            var currentMove = moves.pop();
            //  console.log("alpha player: " + mCurrentPlayer.getName() + "   depth " + depth);
            doNextMove(currentMove);
            if (PVfound) {
                var val = -alphaBeta(depth - 1, -alpha - 1, -alpha);
                //  var val = -alphaBeta(depth - 1, -alpha - 1, -alpha);
                if (val > alpha && val < beta) {
                    val = -alphaBeta(depth - 1, -beta, -val);
                }
            } else {
                val = -alphaBeta(depth - 1, -beta, -alpha);
            }

            //var val = -alphaBeta(depth - 1, -beta, -max);
            undoMove(currentMove);
            if (val > max) {
                if (val >= beta) {
                    return val;
                }
                max = val;
                // start depth
                if (depth == mDepth) {
                    mBestMove = currentMove;
                }
                if (val > alpha) {
                    alpha = val;
                    PVfound = true;
                }

            }
        }
        return max;
    }


    /**
     * getBestMove - calculate the best Opportunity and return the move.
     *
     * @param  {PlayerToken[][][]} gameField needs the gamefield to calculate the moves.
     * @return {obj}           obj with coordinates for the move
     */
    this.getBestMove = function(gameField) {

        mField = gameField.cloneField();
        mCurrentPlayer = mGame.getCurrentPlayer();

        var val = alphaBeta(mDepth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        return mBestMove;
    }


}
