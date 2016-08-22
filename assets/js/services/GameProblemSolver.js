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
        if (numberOfMoves() > 0) return true;

        return false;
    }


    /**
     * numberOfMoves - the number of moves a player can do.
     *
     * @param  {Player} player description
     * @param {PlayerToken[][][]}
     * @return {int}        number of moves
     */
    this.numberOfMoves = function(player, field) {
        if (!field) {
            field = game.gamefield.field;
        }
        var num = 0;
        for (var z = 0; z < field.length; z++) {
            for (var y = 0; y < field[0].length; y++) {
                for (var x = 0; x < field[0][0].length; x++) {
                    var token = field[z][y][x];
                    if (token && (token.getPlayer() === player)) {
                        if (problemSolver.canMoveUp(z, y, x)) num++;
                        if (problemSolver.canMoveDown(z, y, x)) num++;
                        if (problemSolver.canMoveRight(z, y, x)) num++;
                        if (problemSolver.canMoveLeft(z, y, x)) num++;
                    }
                }
            }
        }
        return num;
    }


    /**
     * numberOfToken - counts the token of a player
     *
     * @param  {Player} player description
     * @return {int}        number of token
     */
    this.numberOfToken = function(player) {
        var num = 0;
        var field = game.gamefield.field;
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
     * numberOfPossibleMoves - ignore the opponent and count the number of possible moves.
     *
     * @param  {type} player description
     * @return {int}        number of moves
     */
    this.numberOfPossibleMoves = function(player) {
        var clonedField = game.gamefield.clone().field;
        var num = 0;
        for (var z = 0; z < clonedField.length; z++) {
            for (var y = 0; y < clonedField[0].length; y++) {
                for (var x = 0; x < clonedField[0][0].length; x++) {
                    var token = clonedField[z][y][x];
                    if (token && (token.getPlayer() !== player)) {
                        clonedField[z][y][x] = null;
                    }
                }
            }
        }
        return numberOfMoves(player, clonedField);
    }

    this.numberOfMorris = function(player) {
        var num = 0;
        var field = game.gamefield.field;
        var z01 = true;
        var z10 = true;
        var z21 = true;
        var z12 = true;
        for (var z = 0; z < field.length; z++) {
            var left = true;
            var top = true;
            var bottom = true;
            var right = true;

            for (var i = 0; i < field[0][0].length; i++) {
                var token = clonedField[z][i][0];
                if (!token || (token.getPlayer() !== player)) {
                    left = false;
                }
                token = clonedField[z][0][i];
                if (!token || (token.getPlayer() !== player)) {
                    top = false;
                }
                token = clonedField[z][2][i];
                if (!token || (token.getPlayer() !== player)) {
                    bottom = false;
                }
                token = clonedField[z][i][2];
                if (!token || (token.getPlayer() !== player)) {
                    right = false;
                }

            }
            if (left) num++;
            if (top) num++;
            if (bottom) num++;
            if (right) num++;

            token = clonedField[z][0][1];
            if (!token || (token.getPlayer() !== player)) {
                z01 = false;
            }
            token = clonedField[z][1][0];
            if (!token || (token.getPlayer() !== player)) {
                z10 = false;
            }
            token = clonedField[z][2][1];
            if (!token || (token.getPlayer() !== player)) {
                z21 = false;
            }
            token = clonedField[z][1][2];
            if (!token || (token.getPlayer() !== player)) {
                z12 = false;
            }
        }
        if (z01) num++;
        if (z10) num++;
        if (z21) num++;
        if (z12) num++;
        return num;
    }

    this.numberOfOpenMorris = function() {
        var num = 0;
        var field = game.gamefield.field;
        var z01 = true;
        var z10 = true;
        var z21 = true;
        var z12 = true;
        for (var z = 0; z < field.length; z++) {
            var left = true;
            var top = true;
            var bottom = true;
            var right = true;
            var leftUndef = false;
            var topUndef = false;
            var bottomUndef = false;
            var rightUndef = false;

            for (var i = 0; i < field[0][0].length; i++) {
                var token = clonedField[z][i][0];
                // undefinded token
                if (!token) {
                    // first time undefinded
                    if (!leftUndef) {
                        left = false;
                    } else {
                        leftUndef = true;
                        // y is in the middle
                        if (i == 1) {
                            // z is in the middle. check z0 and z1.
                            if (z == 1) {
                                token = clonedField[z + 1][i][0];
                                if (!token || (token.getPlayer() !== player)) {
                                    token = clonedField[z - 1][i][0];
                                    if (!token || (token.getPlayer() !== player)) {
                                        left = false;
                                    }
                                }
                            } else { // check z- (z-1)
                                token = clonedField[z - (z - 1)][i][0];
                                if (!token || (token.getPlayer() !== player)) {
                                    left = false;
                                }
                            }
                        } else { // just check x1
                            token = clonedField[z][i][1];
                            if (!token || (token.getPlayer() !== player)) {
                                left = false;
                            }
                        }
                    }
                } else if (token.getPlayer() !== player) {
                    left = false;
                }

                //TODO: für alle machen...
                token = clonedField[z][0][i];
                if (!token || (token.getPlayer() !== player)) {
                    top = false;
                }
                token = clonedField[z][2][i];
                if (!token || (token.getPlayer() !== player)) {
                    bottom = false;
                }
                token = clonedField[z][i][2];
                if (!token || (token.getPlayer() !== player)) {
                    right = false;
                }

            }
            if (left) num++;
            if (top) num++;
            if (bottom) num++;
            if (right) num++;

            token = clonedField[z][0][1];
            if (!token || (token.getPlayer() !== player)) {
                z01 = false;
            }
            token = clonedField[z][1][0];
            if (!token || (token.getPlayer() !== player)) {
                z10 = false;
            }
            token = clonedField[z][2][1];
            if (!token || (token.getPlayer() !== player)) {
                z21 = false;
            }
            token = clonedField[z][1][2];
            if (!token || (token.getPlayer() !== player)) {
                z12 = false;
            }
        }
        if (z01) num++;
        if (z10) num++;
        if (z21) num++;
        if (z12) num++;
        return num;
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
