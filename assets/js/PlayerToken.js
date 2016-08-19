function PlayerToken(pID,x,y) {
  var x;
  var y;
  var size;
  var playerID = pID;
  this.move = function(x, y) {
    return;
  }

  this.contains = function() {
    return;
  }

  this.isVisible = function() {
    return this.x === 'undefinied' || this.y === 'undefinied';
  }
}
