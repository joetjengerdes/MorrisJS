function Game(p1, p2) {
    var mode = 1; // 0 end, 1 = start placing, 2 = normal play
    this.removeFlag = 0; // TODO: can we do this with mode?
    this.gamefield = new GameField();
    var player1 = p1;
    var player2 = p2 || new Player("CPU");
    var currentTurn = null;
    var tokensPlaced = 0;
    const MAX_TOKEN_TO_PLACE = 18;
    this.gameProblemSolver = new GameProblemSolver(this);

    /**
     * This function starts a new game, everything
     * is set to default. On a new game the starting
     * player will change. By first start player1
     * is selected as the starting player.
     */
    this.newGame = function() {
        player1.initPlayer();
        player2.initPlayer();
        player2.cpu = 1;
        player2.color = "hsla(120, 100%, 50%, 1)";
        this.gamemode = 0;
        this.gamefield.setToDefault();
        if (currentTurn == null || currentTurn == player2) {
            currentTurn = player1;
        } else {
            currentTurn = player2;
        }
    }

    /**
     * This function returns if the current phase
     * of the game is the phase where players are
     * placing their tokens
     * @return {Boolean} true if it's the placing phase, otherwise false
     */
    this.isPlacingPhase = function() {
        return mode == 1;
    }

    /**
     * This function returns if the game already ended
     * @return {Boolean} true if it's ended, otherwise false
     */
    this.hasEnded = function() {
        return mode == 0;
    }

    /**
     * This function return if player1 is the next player
     * @return {Boolean} true if it's player1's turn, false if it's player2's
     */
    this.isPlayerOneTurn = function() {
        //console.log(currentTurn);
        return currentTurn !== 'undefinied' && currentTurn === player1;
    }

    this.getCurrentPlayer = function() {
        return currentTurn;
    }

    this.getOpponentPlayer = function() {
        return currentTurn === player1 ? player2 : player1;
    }

    /**
     * This function is called if a player ends his turn (and the next player
     * is able to play). If the current phase the placing phase, the tokensPlaced
     * count will count up to determine if the next phase of the game starts.
     */
    this.changeTurn = function() {
        if (mode == 1) {
            tokensPlaced++;
            if (tokensPlaced >= MAX_TOKEN_TO_PLACE) {
                mode = 2;
            }
        }
        currentTurn = currentTurn === player1 ? player2 : player1;
    }

    /**
     * This function creates a new Token places it at the clicked position on the field.
     * If a morris is found, it will set the removeFlag to 1.
     *
     * @param  {int} pos position of the Vertex/vertexId
     */
    this.createToken = function(pos) {
        var token = new PlayerToken(currentTurn);
        token.vertexId = pos;
        var obj = this.convertVertexPosToArrayPos(pos);
        console.log("POSITION: Z Y X :" + obj.z + " | " + obj.y + " | " + obj.x);
        console.log(this.gamefield);
        console.log(this.gamefield.field);
        this.gamefield.field[obj.z][obj.y][obj.x] = token;
        if (this.gameProblemSolver.hasMorris(token)) {
            console.log("MILL!WUHU!");
            this.removeFlag = 1;
        }
    }

    /**
     * Removes a Token by vertexId. And sets the removeFlag to 0.
     *
     * @param  {int} pos position of the Vertex/vertexId n
     * @return {Boolean} success
     */
    this.removeToken = function(pos) {
        console.log(pos);
        var obj = this.convertVertexPosToArrayPos(pos);
        var token = this.gamefield.field[obj.z][obj.y][obj.x];

        if (token.getPlayer() !== currentTurn) {
            this.gamefield.field[obj.z][obj.y][obj.x] = null;
            this.removeFlag = 0;
            return true;
        }
        return false;
    }

    /**
     * This function moves a token from a player which is given as
     * vertex index in posFrom and moves it to a <b>free</b> position
     * given in posTo.
     * @param  {int} posFrom position of token to move
     * @param  {int} posTo   position where to move
     */
    this.moveToken = function(posFrom, posTo) {
        var objTo = this.convertVertexPosToArrayPos(posTo);
        var objFrom = this.convertVertexPosToArrayPos(posFrom);

        var field = this.gamefield.field;

        if (field[objFrom.z][objFrom.y][objFrom.x].getPlayer() === currentTurn &&
            !(field[objTo.z][objTo.y][objTo.x])) {
            this.gamefield.field[objFrom.z][objFrom.y][objFrom.x] = null;
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

    function isTokenOfCurrentPlayer(vertexId) {

    }

    this.newGame();

}
