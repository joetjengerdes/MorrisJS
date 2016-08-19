function DrawController(canvas) {
  this.canvas = canvas;
  var ctx = canvas.getContext("2d");

  function initDrawController() {
    Edge.prototype.draw = function(ctx, x, y, color) {
       ctx.fillStyle = color;
       ctx.beginPath();
       ctx.arc(x, y, this.circleSize, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
    }
  }

  this.drawEdge = function(x,y, color) {

    var e = new Edge(x, y, circleSize * 4)

    e.draw(ctx, x, y, color);
  }

  initDrawController();

}
