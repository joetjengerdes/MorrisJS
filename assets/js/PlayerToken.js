function PlayerToken(p) {
    var player = p;
    var mVertexId = -1;
    var mSelected = false;

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

    this.isSelected = function() {
        return mSelected;
    }
}
