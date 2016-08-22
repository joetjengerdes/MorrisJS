function PlayerToken(p) {
    var size;
    var player = p;
    this.vertexId = -1;
    this.selected = false;

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
