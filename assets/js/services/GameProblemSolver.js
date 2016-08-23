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

        // TODO: rausnehmen nach dem testen
        console.log("CurrenPlayers Moves: " + this.numberOfPossibleMoves(game.getCurrentPlayer()));
        console.log("OpponentPlayers Moves: " + this.numberOfPossibleMoves(game.getOpponentPlayer()));

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
        var field = game.gamefield.field;
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
                        if (this.canMoveUp(z, y, x, field)) num++;
                        if (this.canMoveDown(z, y, x, field)) num++;
                        if (this.canMoveRight(z, y, x, field)) num++;
                        if (this.canMoveLeft(z, y, x, field)) num++;
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
        var clonedField = game.gamefield.cloneField();
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
        return this.numberOfMoves(player, clonedField);
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
        var z01Undef = false;
        var z10Undef = false;
        var z21Undef = false;
        var z12Undef = false;
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

                var flags = checkNeighbours(token, checkNeighboursY, z, i, 0, leftUndef)
                left = flags[0];
                leftUndef = flags[1];

                flags = checkNeighbours(token, checkNeighboursY, z, i, 2, rightUndef)
                right = flags[0];
                rightUndef = flags[1];

                flags = checkNeighbours(token, checkNeighboursX, z, 0, i, topUndef)
                top = flags[0];
                topUndef = flags[1];

                flags = checkNeighbours(token, checkNeighboursX, z, 2, i, bottomUndef)
                bottom = flags[0];
                bottomUndef = flags[1];

            }
            // one token have to be undefinded for a open morris
            if (left && leftUndef) num++;
            if (right && rightUndef) num++;
            if (top && topUndef) num++;
            if (bottom && bottomUndef) num++;

            // Morris of the z-axis
            flags = checkNeighbours(token, checkNeighboursZ, z, 0, 1, z01Undef)
            z01 = flags[0];
            z01Undef = flags[1];


            flags = checkNeighbours(token, checkNeighboursZ, z, 1, 0, z10Undef)
            z10 = flags[0];
            z10Undef = flags[1];

            flags = checkNeighbours(token, checkNeighboursZ, z, 2, 1, z21Undef)
            z21 = flags[0];
            z21Undef = flags[1];

            flags = checkNeighbours(token, checkNeighboursZ, z, 1, 2, z12Undef)
            z12 = flags[0];
            z12Undef = flags[1];
        }
        if (z01 && z01Undef) num++;
        if (z10 && z10Undef) num++;
        if (z21 && z21Undef) num++;
        if (z12 && z12Undef) num++;
        return num;
    }

    function checkNeighbours(token, callback, z, y, x, undefinedFlag) {
        var token = clonedField[z][y][x];
        var openMorrisFlag = true;;
        if (!token) {
            // first time undefined
            if (undefinedFlag) {
                openMorrisFlag = false;
            } else {
                undefinedFlag = true;
                openMorrisFlag = callback(z, 0, 1);
            }
        } else if (token.getPlayer() !== player) {
            openMorrisFlag = false;
        }
        return [openMorrisFlag, undefinedFlag];
    }

    function checkNeighboursX(z, y, x) {
        // x is in the middle
        if (x == 1) {
            // z is in the middle. check z0 and z1.
            if (z == 1) {
                var token = clonedField[z + 1][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    token = clonedField[z - 1][y][x];
                    if (!token || (token.getPlayer() !== player)) {
                        return false;
                    }
                }
            } else { // check z- (z-1)
                var token = clonedField[z - (z - 1)][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }
        } else { // just check y1
            var token = clonedField[z][1][x];
            if (!token || (token.getPlayer() !== player)) {
                return false;
            }
        }
        return true;
    }

    function checkNeighboursY(z, y, x) {
        //is y in the middle
        if (y == 1) {
            // z is in the middle. check z0 and z1.
            if (z == 1) {
                token = clonedField[z + 1][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    token = clonedField[z - 1][y][x];
                    if (!token || (token.getPlayer() !== player)) {
                        return false;
                    }
                }
            } else { // check z- (z-1)
                token = clonedField[z - (z - 1)][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }
        } else { // just check x1
            token = clonedField[z][i][1];
            if (!token || (token.getPlayer() !== player)) {
                return false;
            }
        }
        return true;
    }

    function checkNeighboursZ(z, y, x) {
        //is y
        if (y == 1) {
            token = clonedField[z][y + 1][x];
            if (!token || (token.getPlayer() !== player)) {
                token = clonedField[z][y - 1][x];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }

        } else if (x == 1) { // is x
            token = clonedField[z][y][x + 1];
            if (!token || (token.getPlayer() !== player)) {
                token = clonedField[z][y][x - 1];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }
        }
        return true;
    }

    this.isTokenOnField = function(vertIndex) {
        var coord = game.convertVertexPosToArrayPos(vertIndex);
        //console.log(coord);

        if (game.gamefield.field[coord.z][coord.y][coord.x]) {
            return true;
        }
        return false;
    }

    this.canMoveUp = function(z, y, x, field) {
        if (x == 1) {
            if ((z > 0) && !field[z - 1][y][x]) {
                return true;
            }
        } else if ((y > 0) && !field[z][y - 1][x]) {
            return true;
        }
        return false;
    }

    this.canMoveDown = function(z, y, x, field) {
        if (x == 1) {
            if ((z < 2) && !field[z + 1][y][x]) {
                return true;
            }
        } else if ((y < 2) && !field[z][y + 1][x]) {
            return true;
        }
        return false;
    }

    this.canMoveRight = function(z, y, x, field) {
        if (y == 1) {
            if ((z < 2) && !field[z + 1][y][x]) {
                return true;
            }
        } else if ((x < 2) && !field[z][y][x + 1]) {
            return true;
        }
        return false;
    }

    this.canMoveLeft = function(z, y, x, field) {
        if (y == 1) {
            if ((z > 0) && !field[z - 1][y][x]) {
                return true;
            }
        } else if ((x > 0) && !field[z][y][x - 1]) {
            return true;
        }
        return false;
    }
}
