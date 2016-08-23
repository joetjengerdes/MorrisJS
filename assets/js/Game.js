function Game(player1, player2) {
    var mMode = 1; // 0 end, 1 = start placing, 2 = normal play
    var mRemoveFlag = 0;
    var mGamefield;
    var mPlayer1;
    var mPlayer2;
    var mCurrenTurn = null;
    var mTokensPlaced = 0;
    var mGameProblemSolver;
    const MAX_TOKEN_TO_PLACE = 18;



    /**
     * initGame - This function initializes a the game object and sets member.
     *
     * @param  {Player} p1 description
     * @param  {Player} p2 description
     */
    this.initGame = function(p1, p2) {
        mPlayer1 = p1;
        mPlayer2 = p2 || new Player("CPU");

        mGamefield = new GameField();
        mGameProblemSolver = new GameProblemSolver(this);
        this.newGame();
    }


    /**
     * This function starts a new game, everything
     * is set to default. On a new game the starting
     * player will change. By first start player1
     * is selected as the starting player.
     */
    this.newGame = function() {
        mPlayer1.setGame(this);
        mPlayer1.resetTokenCount();
        mPlayer2.resetTokenCount();
        mPlayer2.setCpu();
        mPlayer2.setColor("hsla(120, 100%, 50%, 1)");
        mPlayer2.setGame(this);
        mMode = 1;
        mGamefield.setToDefault();
        if (mCurrenTurn == null || mCurrenTurn == mPlayer2) {
            mCurrenTurn = mPlayer1;
        } else {
            mCurrenTurn = mPlayer2;
        }
    }

    /**
     * This function returns if the current phase
     * of the game is the phase where players are
     * placing their tokens
     * @return {Boolean} true if it's the placing phase, otherwise false
     */
    this.isPlacingPhase = function() {
        return mMode == 1;
    }

    /**
     * This function returns if the game already ended
     * @return {Boolean} true if it's ended, otherwise false
     */
    this.hasEnded = function() {
        return mMode == 0;
    }

    /**
     * This function return if player1 is the next player
     * @return {Boolean} true if it's player1's turn, false if it's player2's
     */
    this.isPlayerOneTurn = function() {
        //console.log(currentTurn);
        return mCurrenTurn !== 'undefinied' && mCurrenTurn === mPlayer1;
    }

    this.getCurrentPlayer = function() {
        return mCurrenTurn;
    }

    this.getOpponentPlayer = function() {
        return mCurrenTurn === mPlayer1 ? mPlayer2 : mPlayer1;
    }

    /**
     * This function is called if a player ends his turn (and the next player
     * is able to play). If the current phase the placing phase, the tokensPlaced
     * count will count up to determine if the next phase of the game starts.
     */
    this.changeTurn = function() {
        if (mMode == 1) {
            mTokensPlaced++;
            if (mTokensPlaced >= MAX_TOKEN_TO_PLACE) {
                mMode = 2;
            }
        }
        mCurrenTurn = mCurrenTurn === mPlayer1 ? mPlayer2 : mPlayer1;
    }

    /**
     * This function creates a new Token places it at the clicked position on the field.
     * If a morris is found, it will set the removeFlag to 1.
     *
     * @param  {int} pos position of the Vertex/vertexId
     * @param  {Boolean} true if the token is placed, false if it is only created
     * because it has been moved. Default is false.p
     */
    this.createToken = function(pos, placed = false) {
        var token = new PlayerToken(mCurrenTurn);
        token.setVertexIndex(pos);
        var obj = this.convertVertexPosToArrayPos(pos);

        mGamefield.getField()[obj.z][obj.y][obj.x] = token;
        if (mGameProblemSolver.hasMorris(token)) {
            console.log("MILL!WUHU!");
            mRemoveFlag = 1;
        }
        if (placed) {
            mCurrenTurn.placeToken();
        }
    }

    /**
     * Removes a Token by vertexId. And sets the removeFlag to 0.
     *
     * @param  {int} pos position of the Vertex/vertexId n
     * @return {Boolean} success
     */
    this.removeToken = function(pos) {

        var obj = this.convertVertexPosToArrayPos(pos);
        var token = mGamefield.getField()[obj.z][obj.y][obj.x];

        // player selected his own token to remove: not allowed
        if (token.getPlayer() === mCurrenTurn) return false;

        // get the enemy
        var enemy = mCurrenTurn === mPlayer1 ? mPlayer2 : mPlayer1;
        // get all tokens of the enemy that are not in a morris
        var tokenNotInMorris = mGameProblemSolver.getAllTokenNotInMorris(enemy);

        console.log(tokenNotInMorris);

        // enemy player has stones not in a morris, but he selected one in a
        // morris is not allowed. user have to choose another
        if (tokenNotInMorris.length > 0 && tokenNotInMorris.indexOf(token) < 0) {
            return;
        }

        // remove the stone
        mGamefield.getField()[obj.z][obj.y][obj.x] = null;
        mRemoveFlag = 0;
        enemy.lostToken();
        // check if this remove causes the end of the game
        if (enemy.hasLost()) {
            mode = 0;
        }
        return true;
    }


    /**
     * This function moves a token from a player which is given as
     * vertex index in posFrom and moves it to a <b>free</b> position
     * given in posTo.
     * @param  {int} posFrom position of token to move
     * @param  {int} posTo   position where to move
     */
    this.moveToken = function(posFrom, posTo) {
        // player cannot move the token to the selected field
        if (!currentTurn.canJump() && mGameProblemSolver.getPossibleMoves(posFrom).indexOf(posTo) < 0) {
            return;
        }

        var objTo = this.convertVertexPosToArrayPos(posTo);
        var objFrom = this.convertVertexPosToArrayPos(posFrom);

        var field = mGamefield.getField();

        if (field[objFrom.z][objFrom.y][objFrom.x].getPlayer() === mCurrenTurn &&
            !(field[objTo.z][objTo.y][objTo.x])) {
            mGamefield.getField()[objFrom.z][objFrom.y][objFrom.x] = null;
            this.createToken(posTo);
        }
    }

    //TODO: move this function
    this.convertVertexPosToArrayPos = function(pos) {
        var total = 8;
        var z = Math.floor(pos / total);

        var diff = pos % total;
        if (diff > 3) {
            diff++;
        }

        var x = diff % 3;
        var y = Math.floor(diff / 3);

        return {
            x: x,
            y: y,
            z: z
        }
    }

    this.convertArrayPosToVertexPos = function(z, y, x) {
        var base = z * 8;
        var diff = y * 3 + x
        if (diff > 4) {
            diff--;
        }
        var pos = base + diff;

        return pos;
    }

    this.getRemoveFlag = function() {
        return mRemoveFlag;
    }

    this.getGamefield = function() {
        return mGamefield;
    }

    this.getGameProblemSolver = function() {
        return mGameProblemSolver;
    }


    this.initGame(player1, player2);

}
