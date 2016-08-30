function GameProblemSolver(game) {
    var mGame = game;
    var mField = game.getGamefield().getField();
    /**
     * hasMorris - checks if the token is withing a morris.
     *
     * @param  {PlayerToken} token description
     * @return {Boolean}       is there a morris
     */
    this.hasMorris = function(token) {
        var vertexId = token.getVertexIndex();

        // TODO: rausnehmen nach dem testen
        //console.log("CurrenPlayers OpenMorris: " + this.numberOfOpenMorris(mGame.getCurrentPlayer()));
        //console.log("OpponentPlayers OpenMorris: " + this.numberOfOpenMorris(mGame.getOpponentPlayer()));

        var coords = mGame.convertVertexPosToArrayPos(vertexId);

        // row
        var secondToken = mField[coords.z][coords.y][(coords.x + 1) % 3];
        var thirdToken = mField[coords.z][coords.y][(coords.x + 2) % 3];
        var currentToken = mField[coords.z][coords.y][coords.x];
        if (hasSamePlayer(currentToken, secondToken, thirdToken)) {
            return true;
        }

        // column
        secondToken = mField[coords.z][(coords.y + 1) % 3][coords.x]
        thirdToken = mField[coords.z][(coords.y + 2) % 3][coords.x]
        currentToken = mField[coords.z][coords.y][coords.x]
        if (hasSamePlayer(currentToken, secondToken, thirdToken)) {
            return true;
        }

        // z axis
        if (coords.x == 1 || coords.y == 1) {
            secondToken = mField[(coords.z + 1) % 3][coords.y][coords.x];
            thirdToken = mField[(coords.z + 2) % 3][coords.y][coords.x];
            currentToken = mField[coords.z][coords.y][coords.x];
            if (hasSamePlayer(currentToken, secondToken, thirdToken)) {
                return true;
            }
        }
        return false;
    }

    this.getAllTokenNotInMorris = function(player) {
        var tokensNotInMorris = [];
        var allTokens = this.getAllTokenOfPlayer(player);
        //console.log(allTokens);
        for (var i = 0; i < allTokens.length; i++) {
            var token = allTokens[i];
            if (!this.hasMorris(token)) {
                tokensNotInMorris.push(token);
            }
        }
        return tokensNotInMorris;
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
        return this.getAllTokenOfPlayer(player).length;
    }

    /**
     * This functions returns all tokens the given player owns as
     * an array
     * @return {PlayerToken[]} all tokens of a player
     */
    this.getAllTokenOfPlayer = function(player) {
        var tokens = [];
        for (var z = 0; z < mField.length; z++) {
            for (var y = 0; y < mField[0].length; y++) {
                for (var x = 0; x < mField[0][0].length; x++) {
                    var token = mField[z][y][x];
                    if (token && (token.getPlayer() === player)) {
                        tokens.push(token);
                    }
                }
            }
        }
        return tokens;
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
            field = mField;
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
    this.numberOfToken = function(player, field) {
        if (!field) {
            field = mField;
        }
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
     * numberOfPossibleMoves - ignore the opponent and count the number of possible moves.
     *
     * @param  {type} player description
     * @return {int}        number of moves
     */
    this.numberOfPossibleMoves = function(player, clonedField) {
        if (!clonedField) {
            clonedField = mGame.getGamefield().cloneField();;
        }
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

    this.numberOfMorris = function(player, field) {
        if (!field) {
            field = mField;
        }
        var num = 0;
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
                var token = field[z][i][0];
                if (!token || (token.getPlayer() !== player)) {
                    left = false;
                }
                token = field[z][0][i];
                if (!token || (token.getPlayer() !== player)) {
                    top = false;
                }
                token = field[z][2][i];
                if (!token || (token.getPlayer() !== player)) {
                    bottom = false;
                }
                token = field[z][i][2];
                if (!token || (token.getPlayer() !== player)) {
                    right = false;
                }

            }
            if (left) num++;
            if (top) num++;
            if (bottom) num++;
            if (right) num++;

            token = field[z][0][1];
            if (!token || (token.getPlayer() !== player)) {
                z01 = false;
            }
            token = field[z][1][0];
            if (!token || (token.getPlayer() !== player)) {
                z10 = false;
            }
            token = field[z][2][1];
            if (!token || (token.getPlayer() !== player)) {
                z21 = false;
            }
            token = field[z][1][2];
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

    this.numberOfOpenMorris = function(player, field) {
        if (!field) {
            field = mField;
        }

        var num = 0;
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

                var flags = checkNeighbours(player, checkNeighboursY, z, i, 0, leftUndef, field)
                left = flags[0];
                leftUndef = flags[1];

                flags = checkNeighbours(player, checkNeighboursY, z, i, 2, rightUndef, field)
                right = flags[0];
                rightUndef = flags[1];

                flags = checkNeighbours(player, checkNeighboursX, z, 0, i, topUndef, field)
                top = flags[0];
                topUndef = flags[1];

                flags = checkNeighbours(player, checkNeighboursX, z, 2, i, bottomUndef, field)
                bottom = flags[0];
                bottomUndef = flags[1];

            }
            // one token have to be undefinded for a open morris
            if (left && leftUndef) num++;
            if (right && rightUndef) num++;
            if (top && topUndef) num++;
            if (bottom && bottomUndef) num++;

            // Morris of the z-axis
            flags = checkNeighbours(player, checkNeighboursZ, z, 0, 1, z01Undef, field)
            z01 = flags[0];
            z01Undef = flags[1];


            flags = checkNeighbours(player, checkNeighboursZ, z, 1, 0, z10Undef, field)
            z10 = flags[0];
            z10Undef = flags[1];

            flags = checkNeighbours(player, checkNeighboursZ, z, 2, 1, z21Undef, field)
            z21 = flags[0];
            z21Undef = flags[1];

            flags = checkNeighbours(player, checkNeighboursZ, z, 1, 2, z12Undef, field)
            z12 = flags[0];
            z12Undef = flags[1];
        }
        if (z01 && z01Undef) num++;
        if (z10 && z10Undef) num++;
        if (z21 && z21Undef) num++;
        if (z12 && z12Undef) num++;
        return num;
    }

    function checkNeighbours(player, callback, z, y, x, undefinedFlag, field) {

        var token = field[z][y][x];
        var openMorrisFlag = true;;
        if (!token) {
            // first time undefined
            if (undefinedFlag) {
                openMorrisFlag = false;
            } else {
                undefinedFlag = true;
                openMorrisFlag = callback(player, z, y, x, field);
            }
        } else if (token.getPlayer() !== player) {
            openMorrisFlag = false;
        }
        return [openMorrisFlag, undefinedFlag];
    }

    function checkNeighboursX(player, z, y, x, field) {
        // x is in the middle
        if (x == 1) {
            // z is in the middle. check z0 and z1.
            if (z == 1) {
                var token = field[z + 1][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    token = field[z - 1][y][x];
                    if (!token || (token.getPlayer() !== player)) {
                        return false;
                    }
                }
            } else { // check z- (z-1)
                var token = field[z - (z - 1)][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }
        } else { // just check y1
            var token = field[z][1][x];
            if (!token || (token.getPlayer() !== player)) {
                return false;
            }
        }
        return true;
    }

    function checkNeighboursY(player, z, y, x, field) {
        //is y in the middle
        if (y == 1) {
            // z is in the middle. check z0 and z1.
            if (z == 1) {
                token = field[z + 1][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    token = field[z - 1][y][x];
                    if (!token || (token.getPlayer() !== player)) {
                        return false;
                    }
                }
            } else { // check z- (z-1)
                token = field[z - (z - 1)][y][x];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }
        } else { // just check x1
            token = field[z][y][1];
            if (!token || (token.getPlayer() !== player)) {
                return false;
            }
        }
        return true;
    }

    function checkNeighboursZ(player, z, y, x, field) {
        //is y
        if (y == 1) {
            token = field[z][y + 1][x];
            if (!token || (token.getPlayer() !== player)) {
                token = field[z][y - 1][x];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }

        } else if (x == 1) { // is x
            token = field[z][y][x + 1];
            if (!token || (token.getPlayer() !== player)) {
                token = field[z][y][x - 1];
                if (!token || (token.getPlayer() !== player)) {
                    return false;
                }
            }
        }
        return true;
    }

    this.isTokenOnField = function(vertIndex) {
        var coord = mGame.convertVertexPosToArrayPos(vertIndex);

        if (mField[coord.z][coord.y][coord.x]) {
            return true;
        }
        return false;
    }

    /**
     * The functions returns all possible places of the given vertIndex where
     * this could be moved to as an array. This array also contains vertIndeces.
     * A move can be done, if there is a field connect and the field is free
     * (there is no token of any player on it).
     * @param  {int} vertIndex vertex index of the token which should be check
     * @return {int[]}           all vertex indices of possible movements
     */
    this.getPossibleMoves = function(vertIndex) {
        var coords = mGame.convertVertexPosToArrayPos(vertIndex);
        var x = coords.x;
        var y = coords.y;
        var z = coords.z;
        var field = mGame.getGamefield().getField();

        var moves = [];

        var up = this.getMoveUpCoords(z, y, x, field);
        var down = this.getMoveDownCoords(z, y, x, field);
        var left = this.getMoveLeftCoords(z, y, x, field);
        var right = this.getMoveRightCoords(z, y, x, field);

        if (up) {
            moves.push(mGame.convertArrayPosToVertexPos(up.z, up.y, up.x));
        }
        if (down) {
            moves.push(mGame.convertArrayPosToVertexPos(down.z, down.y, down.x));
        }
        if (left) {
            moves.push(mGame.convertArrayPosToVertexPos(left.z, left.y, left.x));
        }
        if (right) {
            moves.push(mGame.convertArrayPosToVertexPos(right.z, right.y, right.x));
        }

        return moves;
    }

    /**
     * Returns if a token can move up from the given coordinates. It can only
     * move, if there is a field and there is no token on it.
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {boolean}       true if you could move up
     */
    this.canMoveUp = function(z, y, x, field) {
        return this.getMoveUpCoords(z, y, x, field) ? true : false;
    }

    /**
     * Returns if a token can move down from the given coordinates. It can only
     * move, if there is a field and there is no token on it.
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {boolean}       true if you could move down
     */
    this.canMoveDown = function(z, y, x, field) {
        return this.getMoveDownCoords(z, y, x, field) ? true : false;
    }

    /**
     * Returns if a token can move right from the given coordinates. It can only
     * move, if there is a field and there is no token on it.
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {boolean}       true if you could move right
     */
    this.canMoveRight = function(z, y, x, field) {
        return this.getMoveRightCoords(z, y, x, field) ? true : false;
    }

    /**
     * Returns if a token can move left from the given coordinates. It can only
     * move, if there is a field and there is no token on it.
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {boolean}       true if you could move left
     */
    this.canMoveLeft = function(z, y, x, field) {
        return this.getMoveLeftCoords(z, y, x, field) ? true : false;
    }

    /**
     * Returns the coordinates of the field above, if there is a field and
     * there is no token on it. Otherwise it returns null
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {x,y,z}       coordinates of field above, if movement could be
     * done, otherwise null
     */
    this.getMoveUpCoords = function(z, y, x, field) {
        if (x == 1) {
            if (y == 0) {
                if ((z > 0) && !field[z - 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z - 1
                    };
                }
            } else if (y == 2) {
                if ((z < 2) && !field[z + 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z + 1
                    };
                }
            }

        } else if ((y > 0) && !field[z][y - 1][x]) {
            return {
                x: x,
                y: y - 1,
                z: z
            };
        }
        return null;
    }

    /**
     * Returns the coordinates of the field below, if there is a field and
     * there is no token on it. Otherwise it returns null
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {x,y,z}       coordinates of field below, if movement could be
     * done, otherwise null
     */
    this.getMoveDownCoords = function(z, y, x, field) {
        if (x == 1) {
            if (y == 0) {
                if ((z < 2) && !field[z + 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z + 1
                    };
                }
            } else if (y == 2) {
                if ((z > 0) && !field[z - 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z - 1
                    };
                }
            }

        } else if ((y < 2) && !field[z][y + 1][x]) {
            return {
                x: x,
                y: y + 1,
                z: z
            };
        }
        return null;
    }

    /**
     * Returns the coordinates of the field to the left, if there is a field and
     * there is no token on it. Otherwise it returns null
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {x,y,z}       coordinates of left field, if movement could be
     * done, otherwise null
     */
    this.getMoveRightCoords = function(z, y, x, field) {
        if (y == 1) {
            if (x == 0) {
                if ((z < 2) && !field[z + 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z + 1
                    };
                }
            } else if (x == 2) {
                if ((z > 0) && !field[z - 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z - 1
                    };
                }
            }

        } else if ((x < 2) && !field[z][y][x + 1]) {
            return {
                x: x + 1,
                y: y,
                z: z
            };
        }
        return null;
    }

    /**
     * Returns the coordinates of the field to the right, if there is a field and
     * there is no token on it. Otherwise it returns null
     * @param  {int} z     z coordinate
     * @param  {int} y     y coordinates
     * @param  {int} x     x coordinates
     * @param  {PlayerToken[][][]} field the getGamefield() as an 3d array
     * @return {x,y,z}       coordinates of right field, if movement could be
     * done, otherwise null
     */
    this.getMoveLeftCoords = function(z, y, x, field) {
        if (y == 1) {
            // left side
            if (x == 0) {
                if ((z > 0) && !field[z - 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z - 1
                    };
                }
            } else if (x == 2) { // right side
                if ((z < 2) && !field[z + 1][y][x]) {
                    return {
                        x: x,
                        y: y,
                        z: z + 1
                    };
                }
            }
        } else if ((x > 0) && !field[z][y][x - 1]) {
            return {
                x: x - 1,
                y: y,
                z: z
            };
        }
        return null;
    }
}
