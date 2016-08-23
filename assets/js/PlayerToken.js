function PlayerToken(p) {
    var mPlayer = p;
    var mVertexId = -1;
    var mSelected = false;

    this.getColor = function() {
        return mPlayer.getColor();
    }

    this.getPlayer = function() {
        return mPlayer;
    }

    this.isSelected = function() {
        return mSelected;
    }

    this.select = function() {
        mSelected = true;
    }

    this.unselect = function() {
        mSelected = false;
    }

    this.getVertexIndex = function() {
        return mVertexId;
    }

    this.setVertexIndex = function(vertexIndex) {
        mVertexId = vertexIndex;
    }
}
