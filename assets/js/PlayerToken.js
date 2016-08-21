function PlayerToken(pID, x, y, p) {
    var x;
    var y;
    var size;
    var player = p;
    this.vertexId = -1;
    this.selected = 1;

    this.move = function(x, y) {
        return;
    }

    this.contains = function() {
        return;
    }

    this.isVisible = function() {
        return this.x === 'undefinied' || this.y === 'undefinied';
    }

    this.getColor = function() {
        return player.color;
    }

    this.getPlayer = function() {
        return player;
    }
}
