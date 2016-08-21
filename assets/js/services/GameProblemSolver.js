function GameProblemSolver(game) {
    var game = game;



    /**
     * hasMorris - checks if the token is withing a morris.
     *
     * @param  {PlayerToken} token description
     * @return {Boolean}       is there a morris
     */
    this.hasMorris = function(token) {
        var field = game.gamefield.field;
        var vertexId = token.vertexId;

        var coords = game.convertVertexPosToArrayPos(vertexId);

        // row
        var secondToken = field[coords.z][coords.y][(coords.x + 1) % 3];
        var thirdToken = field[coords.z][coords.y][(coords.x + 2) % 3];
        var currentToken = field[coords.z][coords.y][coords.x];
        if (hasSamePlayer(currentToken, secondToken, thirdToken)) return true;

        // column
        secondToken = field[coords.z][(coords.y + 1) % 3][coords.x]
        thirdToken = field[coords.z][(coords.y + 2) % 3][coords.x]
        currentToken = field[coords.z][coords.y][coords.x]
        if (hasSamePlayer(currentToken, secondToken, thirdToken)) return true;

        if (coords.x == 1 || coords.y == 1) {
            secondToken = field[(coords.z + 1) % 3][coords.y][coords.x];
            thirdToken = field[(coords.z + 2) % 3][coords.y][coords.x];
            currentToken = field[coords.z][coords.y][coords.x];
            if (hasSamePlayer(currentToken, secondToken, thirdToken)) return true;
        }
        return false;
    }


    /**
     * hasSamePlayer - checks if the token have the same owner.
     *
     * @param  {PlayerToken} firstToken  description
     * @param  {PlayerToken} secondToken description
     * @param  {PlayerToken} thirdToken  description
     * @return {Boolean}            {true} if the token have the same  owner. {false} else.
     */
    function hasSamePlayer(firstToken, secondToken, thirdToken) {
        if (firstToken && secondToken && thirdToken) {
            console.log(firstToken.getPlayer());
            console.log(secondToken.getPlayer());
            console.log(thirdToken.getPlayer());
            console.log(firstToken + " " + secondToken + " " + thirdToken);
            if (firstToken.getPlayer() === secondToken.getPlayer() && firstToken.getPlayer() === thirdToken.getPlayer()) {
                return true;
            }
        }
        return false;
    }

    /**
     * getNumberOfToken - count the token of the specified player
     *
     * @param  {Player} player description
     * @return {int}        number of Token
     */
    this.getNumberOfToken = function(player) {
        var num = 0;
        for (var z = 0; z < field.length; z++) {
            for (var y = 0; y < field[0].length; y++) {
                for (var x = 0; x < field[0][0].length; x++) {
                    var token = field[z][y][x];
                    if (token && (token.getPlayer() === player)) {
                        num++;
                    }
                }
            }
        }
        return num;
    }

    /**
     * canMakeMoves - Can a player move a token
     *
     * @param  {Player} player description
     * @return {Boolean}        description
     */
    this.canMakeMoves = function(player) {
        for (var z = 0; z < field.length; z++) {
            for (var y = 0; y < field[0].length; y++) {
                for (var x = 0; x < field[0][0].length; x++) {
                    var token = field[z][y][x];
                    if (token && (token.getPlayer() === player)) {
                        if (problemSolver.canMoveUp(z, y, x) ||
                            problemSolver.canMoveDown(z, y, x) ||
                            problemSolver.canMoveRight(z, y, x) ||
                            problemSolver.canMoveLeft(z, y, x)) {
                            return true;
                        }
                    }
                }
            }
        }
        return true;
    }

    this.isTokenOnField = function(vertIndex) {
        var coord = game.convertVertexPosToArrayPos(vertIndex);
        if (game.gamefield.field[coord.z][coord.y][coord.x]) {
            return true;
        }
        return false;
    }

    this.canMoveUp = function(z, y, x, field) {
        if (y > 0 && !filed[z][y - 1][x]) {
            return true;
        }
        return false;
    }

    this.canMoveDown = function(z, y, x) {
        if (y < 2 && !filed[z][y + 1][x]) {
            return true;
        }
        return false;
    }

    this.canMoveRight = function(z, y, x) {
        if (x < 2 && !filed[z][y][x + 1]) {
            return true;
        }
        return false;
    }

    this.canMoveLeft = function(z, y, x) {
        if (x > 0 && !filed[z][y][x - 1]) {
            return true;
        }
        return false;
    }

}
