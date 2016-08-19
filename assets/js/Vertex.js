function Vertex(x,y,circleSize) {
  this.x = x ;
  this.y = y ;
  this.circleSize = circleSize;
  this.fill = '#000000';
  this.playerID = 0;
  // position of the Vertex
  this.postiion = -1;

  this.contains = function(mx, my) {
     var factor = 2.5;
     if ((this.x - this.circleSize * factor) < mx && (this.x + this.circleSize * factor) > mx) {
        if ((this.y - this.circleSize * factor) <= my && (this.y + this.circleSize * factor) >= my) {
           return true;
        }
     }
     return false;
  }

}
