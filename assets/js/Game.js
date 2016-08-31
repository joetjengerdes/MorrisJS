function Game(gsb, player1, player2) {
    const MAX_TOKEN_TO_PLACE = 18;
    var self = this;
    var mMode = 1; // 0 end, 1 = start placing, 2 = normal play
    var mWaitForRemoveToken = 0;
    var mGamefield;
    var mPlayer1;
    var mPlayer2;
    var mCurrentPlayer = null;
    var mStartingPlayer = null;
    var mTokensPlaced = 0;
    var mGameProblemSolver;
    var mSoundController;
    var mGameStatusBar = gsb;
    var mSelectedPlayerToken;
    var mArtificialIntelligenceService;
    var mError;


    /**
     * getNumberTokenPlaced - this function return the number of placed token.
     * this is important for the placing phase.    
     *
     * @return {type}  description
     */
    this.getNumberTokenPlaced = function() {
        return mTokensPlaced;
    }

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
        mArtificialIntelligenceService = new ArtificialIntelligenceService(this);
        mSoundController = new SoundController();
    }


    /**
     * This function starts a new game, everything
     * is set to default. On a new game the starting
     * player will change. By first start player1
     * is selected as the starting player.
     */
    this.newGame = function() {
        mMode = 1;
        mTokensPlaced = 0;
        mPlayer1.setGame(this);
        mPlayer1.resetTokenCount();
        mPlayer2.resetTokenCount();
        mPlayer2.setCpu();
        mPlayer2.setColor("hsla(120, 100%, 50%, 1)");
        mPlayer2.setGame(this);
        mGamefield.setToDefault();

        if (mStartingPlayer == null || mStartingPlayer === mPlayer2) {
            mCurrentPlayer = mPlayer1;
            mStartingPlayer = mPlayer1;
        } else {
            mCurrentPlayer = mPlayer2;
            mStartingPlayer = mPlayer2;
        }

        if (mCurrentPlayer.isCPU()) {
            mGameStatusBar.setText('It\'s CPU\'s turn!');
            this.doTurnCPU();
            mGameStatusBar.setText('It\'s your turn. Place a token!');
        }
        mGameStatusBar.setText("New game started!", 'general');
    }

    /**
     * This function returns if the current phase
     * of the game is the phase where players are
     * placing their token
     * @return {Boolean} true if it's the placing phase, otherwise false
     */
    this.isPlacingPhase = function() {
        return mMode == 1;
    }

    /**
     * This function returns if the current phase
     * of the game is the phase where players are
     * moving their token
     * @return {Boolean} true if it's the moving phase, otherwise false
     */
    this.isNormalPhase = function() {
        return mMode == 2;
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
        return mCurrentPlayer !== 'undefinied' && mCurrentPlayer === mPlayer1;
    }

    this.getCurrentPlayer = function() {
        return mCurrentPlayer;
    }

    this.getOpponentPlayer = function() {
        return mCurrentPlayer === mPlayer1 ? mPlayer2 : mPlayer1;
    }

    /**
     * This function is called if a player ends his turn (and the next player
     * is able to play). If the current phase the placing phase, the tokensPlaced
     * count will count up to determine if the next phase of the game starts.
     */
    this.changeTurn = function() {

        // is placingphase
        if (mMode == 1) {
            mTokensPlaced++;
            mGameStatusBar.setText("Placed a token", 'actionDone', mCurrentPlayer);
            if (mTokensPlaced >= MAX_TOKEN_TO_PLACE) {
                mMode = 2;
            }
        }
        if (mMode == 2) { // movephase
            if (checkIfEnemyCannotMove()) {
                currentPlayerWonGame();
                return;
            }
            mGameStatusBar.setText("Select token which you want to move.", 'doAction', this.getOpponentPlayer());
        }
        mCurrentPlayer = mCurrentPlayer === mPlayer1 ? mPlayer2 : mPlayer1;
    }

    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    function currentPlayerWonGame() {
        mMode = 0;
        mGameStatusBar.setText(mCurrentPlayer.getName() + " won!", 'actionDone', mCurrentPlayer);
        mGameStatusBar.setText("Game ended!", 'general');
    }

    function checkIfEnemyCannotMove() {
        if (mGameProblemSolver.numberOfMoves(self.getOpponentPlayer()) == 0) {
            return true;
        }
        return false;
    }

    this.doTurnCPU = function() {
        if (!mCurrentPlayer.isCPU()) return;


        var move = mArtificialIntelligenceService.getBestMove(mGamefield);
        console.log("BESTMOVE( z y x ): " + move.dst.z + " " + move.dst.y + " " + move.dst.x);
        var i = this.convertArrayPosToVertexPos(move.dst.z, move.dst.y, move.dst.x);
        if (self.isPlacingPhase()) {
            if (!mGameProblemSolver.isTokenOnField(i)) {

                self.createToken(i, true);

                if (mWaitForRemoveToken) {
                    var vertices = mGamefield.getVertices();
                    for (var i = 0; i < vertices.length; i++) {
                        if (mGameProblemSolver.isTokenOnField(i) && self.removeToken(i)) {
                            break;
                        }
                    }
                    mGameStatusBar.setText(mCurrentPlayer.getName() +
                        " removed a token of " + this.getOpponentPlayer().getName(),
                        'actionDone', mCurrentPlayer, this.getOpponentPlayer());

                    //TODO: auch oben: was tun falls nur mühlen. und redundanzen entfernen!
                }
                self.changeTurn();
            }
        } else {
            var field = mGamefield.getField();

            var src = this.convertArrayPosToVertexPos(move.src.z, move.src.y, move.src.x);

            console.log("AUFRUG MOVE CPU");
            //console.log("from " + i + " to " + moves[0]);
            if (self.moveToken(src, i)) {
                if (mWaitForRemoveToken) {
                    var vertices = mGamefield.getVertices();
                    for (var i = 0; i < vertices.length; i++) {
                        if (mGameProblemSolver.isTokenOnField(i) && self.removeToken(i)) {
                            break;
                        }
                    }
                    //TODO: auch oben: was tun falls nur mühlen. und redundanzen entfernen!
                }
                self.changeTurn();
            }

        }

        /*
                if (self.isPlacingPhase()) {
                    var vertices = mGamefield.getVertices();
                    for (var i = 0; i < vertices.length; i++) {
                        //var coord = mGame.convertVertexPosToArrayPos(i);
                        //console.log(coord);
                        if (!mGameProblemSolver.isTokenOnField(i)) {
                            //console.log(mGame.getGamefield().field[coord.z][coord.y][coord.x]);
                            self.createToken(i, true);
                            //drawController.drawVertex(vertices[i].x, vertices[i].y, "#00FF00");

                            if (mWaitForRemoveToken) {
                                var vertices = mGamefield.getVertices();
                                for (var i = 0; i < vertices.length; i++) {
                                    if (mGameProblemSolver.isTokenOnField(i) && self.removeToken(i)) {
                                        break;
                                    }
                                }
                                mGameStatusBar.setText(mCurrentTurn.getName() +
                                    " removed a token of " + this.getOpponentPlayer().getName(),
                                    false, mCurrentTurn, this.getOpponentPlayer());

                                //TODO: auch oben: was tun falls nur mühlen. und redundanzen entfernen!
                            }
                            self.changeTurn();
                            break;
                        }
                    }
                } else {
                    var vertices = mGamefield.getVertices();
                    for (var i = 0; i < vertices.length; i++) {

                        var coords = self.convertVertexPosToArrayPos(i);
                        var field = mGamefield.getField();
                        if (!mGameProblemSolver.isTokenOnField(i) ||
                            field[coords.z][coords.y][coords.x].getPlayer() !== mCurrentTurn) {
                            continue;
                        }
                        var moves = mGameProblemSolver.getPossibleMoves(i);
                        if (moves.length > 0) {
                            console.log("AUFRUG MOVE CPU");
                            //console.log("from " + i + " to " + moves[0]);
                            if (self.moveToken(i, moves[0])) {
                                if (mWaitForRemoveToken) {
                                    var vertices = mGamefield.getVertices();
                                    for (var i = 0; i < vertices.length; i++) {
                                        if (mGameProblemSolver.isTokenOnField(i) && self.removeToken(i)) {
                                            break;
                                        }
                                    }
                                    //TODO: auch oben: was tun falls nur mühlen. und redundanzen entfernen!
                                }
                                self.changeTurn();
                            }
                            break;
                        }
                    }
                }
                */

    }


    /**
     * This function creates a new Token places it at the clicked position on the field.
     * If a morris is found, it will set the removeFlag to 1.
     *
     * @param  {int} pos position of the Vertex/vertexId
     * @param  {Boolean} true if the token is placed, false if it is only created
     * because it has been moved. Default is false.
     */
    this.createToken = function(pos, placed = false) {
        var token = new PlayerToken(mCurrentPlayer);
        token.setVertexIndex(pos);
        var obj = this.convertVertexPosToArrayPos(pos);

        mGamefield.getField()[obj.z][obj.y][obj.x] = token;
        if (mGameProblemSolver.hasMorris(token)) {
            mWaitForRemoveToken = true;
        }
        if (placed) {
            mCurrentPlayer.placeToken();
        }
        mSoundController.playMoveSound();
    }

    this.hasPlayerToRemoveToken = function() {
        return mWaitForRemoveToken;
    }

    this.isTokenSelected = function() {
        return mSelectedPlayerToken;
    }

    this.getError = function() {
        return mError;
    }

    this.doAction = function(selectedVertex) {
        mError = null;
        // player has a morris
        if (mWaitForRemoveToken) {
            if (this.removeToken(selectedVertex)) {
                mGameStatusBar.setText(mCurrentPlayer.getName() +
                    " removed a token of " + this.getOpponentPlayer().getName(),
                    'actionDone', mCurrentPlayer, this.getOpponentPlayer());
                this.changeTurn();
            } else {
                mError = 'You cannot remove your own, none or the enemies token in a morris if he has free ones. Select another!';
            }
        } else {
            if (this.isPlacingPhase()) {

                if (!mGameProblemSolver.isTokenOnField(selectedVertex)) {
                    this.createToken(selectedVertex, true);

                    if (!mWaitForRemoveToken) {
                        this.changeTurn();
                    } else {
                        mGameStatusBar.setText("Click the token you want to remove", 'doAction', mCurrentPlayer);
                    }
                } else {
                    mError = 'There is already a token on the field. Place on a free spot';
                }
            } else if (this.isNormalPhase()) {
                if (mGameProblemSolver.isTokenOnField(selectedVertex)) {
                    var token = getTokenOfField(selectedVertex);
                    if (token.getPlayer() !== this.getCurrentPlayer()) return;
                    selectToken(token);
                    console.log("selected " + token);
                }
                // player clicked on a free spot, so he wants to move the selected
                else {
                    // player did not select any token to move
                    if (!mSelectedPlayerToken) {
                        mError = 'You have to select a token before you can move one';
                        return;
                    }

                    if (this.moveToken(mSelectedPlayerToken.getVertexIndex(), selectedVertex)) {
                        if (!mWaitForRemoveToken) {
                            this.changeTurn();
                        } else {
                            mGameStatusBar.setText("It's " + mCurrentPlayer.getName() +
                                "'s turn. Click the token you want to remove", 'doAction');
                        }
                    }
                    unselectSelectedToken();
                }
            }
        }
    }

    function doMovement(x, y) {
        mGame.moveToken(mSelectedPlayerToken.getVertexIndex(),
            getVerticeIndexOfCoords(x, y));
    }

    function selectToken(token) {
        unselectSelectedToken();
        token.select();
        mSelectedPlayerToken = token;
    }

    function unselectSelectedToken() {
        if (mSelectedPlayerToken) {
            mSelectedPlayerToken.unselect();
        }
        mSelectedPlayerToken = null;
    }

    function getTokenOfField(vertIndex) {
        var coord = self.convertVertexPosToArrayPos(vertIndex);
        return mGamefield.getField()[coord.z][coord.y][coord.x];
    }




    /*  if (mGame.getRemoveFlag() == 0) {
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
                unselectSelectedToken();
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
}*/

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
        if (token && token.getPlayer() === mCurrentPlayer) return false;

        // get the enemy
        var enemy = this.getOpponentPlayer();
        // get all tokens of the enemy that are not in a morris
        var tokenNotInMorris = mGameProblemSolver.getAllTokenNotInMorris(enemy);

        // enemy player has stones not in a morris, but he selected one in a
        // morris is not allowed. user have to choose another
        if (tokenNotInMorris.length > 0 && tokenNotInMorris.indexOf(token) < 0) {
            return;
        }

        // remove the stone
        mGamefield.getField()[obj.z][obj.y][obj.x] = null;
        mWaitForRemoveToken = false;
        enemy.lostToken();
        // check if this remove causes the end of the game
        if (enemy.hasLost()) {
            currentPlayerWonGame();
        }

        mSoundController.playTokenStealSound();

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
        if (!mCurrentPlayer.canJump() && mGameProblemSolver.getPossibleMoves(posFrom).indexOf(posTo) < 0) {
            return false;
        }

        var objTo = this.convertVertexPosToArrayPos(posTo);
        var objFrom = this.convertVertexPosToArrayPos(posFrom);

        var field = mGamefield.getField();

        if (field[objFrom.z][objFrom.y][objFrom.x].getPlayer() === mCurrentPlayer &&
            !(field[objTo.z][objTo.y][objTo.x])) {
            field[objFrom.z][objFrom.y][objFrom.x] = null;
            this.createToken(posTo);
            return true;
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
        };
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
        return mWaitForRemoveToken;
    }

    this.getGamefield = function() {
        return mGamefield;
    }

    this.getGameProblemSolver = function() {
        return mGameProblemSolver;
    }

    this.initGame(player1, player2);

}
