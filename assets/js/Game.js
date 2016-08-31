/**
 * Game represents the game, it has a gamefield and different
 * functions for different actions. Like move, remove etc.
 * @param {GameStatusBar} gsb     GameStatusBar for settings actions
 * @param {Player} player1 the first player
 * @param {Player} player2 the second player, if not set, their'll be a
 * cpu controlled enemy
 */
function Game(gsb, player1, player2) {
    // max tokens you can place in the game
    const MAX_TOKEN_TO_PLACE = 18;
    // self reference
    var self = this;
    // 0 end, 1 = start placing, 2 = normal play
    var mMode = 1;
    // flags which indicates if a token must be removed
    var mWaitForRemoveToken = 0;
    // reference of the gamefield
    var mGamefield;
    // reference of player1
    var mPlayer1;
    // reference of player2
    var mPlayer2;
    // holds the player whose turn is now
    var mCurrentPlayer = null;
    // holds the player who started the last game
    var mStartingPlayer = null;
    // counter for the tokens placed, this is never
    // decreased (if s.o. removes one)
    var mTokensPlaced = 0;
    // reference of the problem solver for determining the
    // different game situations
    var mGameProblemSolver;
    // reference of the sound controller for playing sounds
    var mSoundController;
    // reference of the statusbar for printing actions
    var mGameStatusBar = gsb;
    // holds the selected token, if the player selected one
    var mSelectedPlayerToken;
    // the service for doing the cpu turns
    var mArtificialIntelligenceService;
    // holds if there is an error and holds the error
    // the game end is a special case, as it is listed here
    // as an error
    var mError;

    /**
     * Sets the difficulty of the CPU
     * @param {String} diff the difficulty: easy, middle or hard
     */
    this.setDifficulty = function(diff) {
        console.log(diff);
        switch (diff) {
            case 'easy':
                mArtificialIntelligenceService.setDepth(2);
                break;
            case 'middle':
                mArtificialIntelligenceService.setDepth(3);
                break;
            case 'hard':
                mArtificialIntelligenceService.setDepth(4);
                break;
        }
    }

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

    /**
     * Return the current Player
     * @return {Player} the player who's turn is now
     */
    this.getCurrentPlayer = function() {
        return mCurrentPlayer;
    }

    /**
     * Return the enemy player
     * @return {Player} the enemy player
     */
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

    /**
     * Function to set that the current player won the game.
     * This will be printed and the gamemode will be set to end
     */
    function currentPlayerWonGame() {
        mError = "Game ended: " + mCurrentPlayer.getName() + " won!", 'actionDone', mCurrentPlayer;
        mMode = 0;
        mGameStatusBar.setText(mCurrentPlayer.getName() + " won!", 'actionDone', mCurrentPlayer);
        mGameStatusBar.setText("Game ended!", 'general');
    }

    /**
     * Checks whether the enemy can move or cannot move
     * @return {Boolean} true if he cannot move, otherwise false
     */
    function checkIfEnemyCannotMove() {
        if (mGameProblemSolver.numberOfMoves(self.getOpponentPlayer()) == 0) {
            return true;
        }
        return false;
    }

    /**
     * Functions that does the move of the cpu
     * it uses the ArtificialIntelligenceService to
     * determine the best move for it's difficulty
     */
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

    /**
     * Returns if the player has to remove a token
     * @return {Boolean} true if he has to remove one, otherwise false
     */
    this.hasPlayerToRemoveToken = function() {
        return mWaitForRemoveToken;
    }

    /**
     * Returns if a token is selected
     * @return {Boolean} true if a token is selected, otherwise false
     */
    this.isTokenSelected = function() {
        return mSelectedPlayerToken;
    }

    /**
     * Return the error or null if there isn't one
     * @return {String} Errormessage or null if there is no error
     */
    this.getError = function() {
        return mError;
    }

    /**
     * Does the human action. Checks which game mode is
     * currently and what he can do. E.g. if the removeFlag
     * is set or not
     * @param  {Integer} selectedVertex the vertex id of the token or vertex he
     * selected
     */
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

    /**
     * Selects a token
     * @param  {PlayerToken} token token to be selected
     */
    function selectToken(token) {
        unselectSelectedToken();
        token.select();
        mSelectedPlayerToken = token;
    }

    /**
     * Unselects a token
     * @param  {PlayerToken} token token to be unselected
     */
    function unselectSelectedToken() {
        if (mSelectedPlayerToken) {
            mSelectedPlayerToken.unselect();
        }
        mSelectedPlayerToken = null;
    }

    /**
     * Gets the token off the given vertex id
     * @param  {Integer} vertIndex vertex id to get the token from
     * @return {PlayerToken}           token on this position
     */
    function getTokenOfField(vertIndex) {
        var coord = self.convertVertexPosToArrayPos(vertIndex);
        return mGamefield.getField()[coord.z][coord.y][coord.x];
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

    /**
     * This function converts a vertex id to the position in the 3d array
     * @param  {Integer} pos vertex id
     * @return {Object}     x,y,z coordinates of the position in the 3d array
     */
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

    /**
     * This function converts the position in the 3d array to a vertex id
     * @param  {Integer} z z coordiante
     * @param  {Integer} y y coordinate
     * @param  {Integer} x x coordinate
     * @return {Integer}   vertex id
     */
    this.convertArrayPosToVertexPos = function(z, y, x) {
        var base = z * 8;
        var diff = y * 3 + x
        if (diff > 4) {
            diff--;
        }
        var pos = base + diff;

        return pos;
    }

    /**
     * Return true if the player needs to remove a token
     * @return {Boolean} true if he has to remove, false otherwise
     */
    this.getRemoveFlag = function() {
        return mWaitForRemoveToken;
    }

    /**
     * Returns the gamefield of the game
     * @return {gamefield} the gamefield
     */
    this.getGamefield = function() {
        return mGamefield;
    }

    /**
     * Return the gameProblemSolver
     * @return {gameProblemSolver} the gameProblemSolver
     */
    this.getGameProblemSolver = function() {
        return mGameProblemSolver;
    }

    this.initGame(player1, player2);

}
