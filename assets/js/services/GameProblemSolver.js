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
        hasSamePlayer(currentToken, secondToken, thirdToken);

        // column
        secondToken = field[coords.z][(coords.y + 1) % 3][coords.x]
        thirdToken = field[coords.z][(coords.y + 2) % 3][coords.x]
        currentToken = field[coords.z][coords.y][coords.x]
        hasSamePlayer(currentToken, secondToken, thirdToken);


        if (coords.x == 1 || coords.y == 1) {
            secondToken = field[(coords.z + 1) % 3][coords.y][coords.x]
            thirdToken = field[(coords.z + 2) % 3][coords.y][coords.x]
            firstToken = field[coords.z][coords.y][coords.x]
            hasSamePlayer(currentToken, secondToken, thirdToken);
        }

    }

    function hasSamePlayer(firstToken, secondToken, thirdToken) {
        if (firstToken && secondToken && thirdToken) {
            console.log(firstToken.player + " " + secondToken.player + " " + thirdToken.player);
            if (firstToken.player == secondToken.player == thirdToken.player) {
                return true;
            }
        }
        return false;
    }

}