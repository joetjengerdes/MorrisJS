function PlayerToken(x,y) {
  this.x;
  this.y;
  this.size;

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
