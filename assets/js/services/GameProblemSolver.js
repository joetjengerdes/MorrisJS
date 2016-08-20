function GameProblemSolver(game) {
    var game = game;


    this.hasMorris = function(token) {
        var field = game.gamefield.field;
        var vertexId = token.vertexId;

        var coords = game.convertVertexPosToArrayPos(vertexId);


        // row
        var secondToken = field[coords.z][coords.y][(coords.x + 1) % 3];
        var thirdToken = field[coords.z][coords.y][(coords.x + 2) % 3];
        var currentToken = field[coords.z][coords.y][coords.x];
        if(hasSamePlayer(currentToken, secondToken, thirdToken)) return true;

        // column
        secondToken = field[coords.z][(coords.y + 1) % 3][coords.x]
        thirdToken = field[coords.z][(coords.y + 2) % 3][coords.x]
        currentToken = field[coords.z][coords.y][coords.x]
        if(hasSamePlayer(currentToken, secondToken, thirdToken)) return true;


        console.log("-------------------->deni <3 z y x" + coords.z + " " + coords.y + " " + coords.x);
        if (coords.x == 1 || coords.y == 1) {
            secondToken = field[(coords.z + 1) % 3][coords.y][coords.x];
            thirdToken = field[(coords.z + 2) % 3][coords.y][coords.x];
            currentToken = field[coords.z][coords.y][coords.x];
            if(hasSamePlayer(currentToken, secondToken, thirdToken)) return true;
        }
        return false;
    }

    function hasSamePlayer(firstToken, secondToken, thirdToken) {
        if (firstToken && secondToken && thirdToken) {
            console.log(firstToken.getPlayer());
            console.log(secondToken.getPlayer());
            console.log(thirdToken.getPlayer());
            console.log(firstToken+ " " + secondToken + " " + thirdToken);
            if (firstToken.getPlayer() === secondToken.getPlayer() && firstToken.getPlayer() === thirdToken.getPlayer()) {
                return true;
            }
        }
        return false;
    }

    this.isTokenOnField = function(vertIndex) {
        var coord = game.convertVertexPosToArrayPos(vertIndex);
        if (game.gamefield.field[coord.z][coord.y][coord.x]) {
            return true;
        }
        return false;
    }

}
