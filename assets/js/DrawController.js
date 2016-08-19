function DrawController(canvas, gf) {
  this.canvas = canvas;
  var gamefield = gf;
  var ctx = canvas.getContext("2d");

  function initDrawController() {
    Vertex.prototype.draw = function(ctx, x, y, color) {
       ctx.fillStyle = this.fill;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.circleSize, 0, Math.PI * 2, true);
       ctx.closePath();
       ctx.fill();
    }
  }

  this.drawVertex = function(x,y, color) {
    var v = new Vertex(x, y, gamefield.circleSize * 2.5);
    v.draw(ctx, x, y, color);
  }

  this.redraw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gamefield.vertices = [];
    drawField();
  }

  function drawField() {
    var h = gamefield.height;
    var w = gamefield.width;
    var spaceBetween = gamefield.spaceBetween;
    var leftOffset = gamefield.leftOffset;

     drawFieldPart(ctx, 0, 0, h, w);
     drawFieldPart(ctx, spaceBetween, spaceBetween, h - spaceBetween, w - spaceBetween);
     drawFieldPart(ctx, 2 * spaceBetween, 2 * spaceBetween, h - 2 * spaceBetween, w - 2 * spaceBetween);

     // von links bis mitte
     drawLine(ctx, leftOffset + 0 + 50, ((h + 0) / 2), leftOffset + spaceBetween * 2 + 50, ((h + 0) / 2));
     // von rechts bis mitte
     drawLine(ctx, leftOffset + w - 50, ((h + 0) / 2), leftOffset + w - spaceBetween * 2 - 50, ((h + 0) / 2));

     // von oben bis mitte
     drawLine(ctx, leftOffset + (w / 2), 50, leftOffset + (w / 2), spaceBetween * 2 + 50);
     // von unten bis mitte
     drawLine(ctx, leftOffset + (w / 2), h - 50, leftOffset + (w / 2), h - 50 - spaceBetween * 2);

     for (i = 0; i < gamefield.vertices.length; i++) {
        gamefield.vertices[i].draw(ctx);
        //console.log(gamefield.vertices[i].draw);
     }
  }

  function drawFieldPart(ctx, hFrom, wFrom, hTo, wTo, offset = 50) {
     /*
 drawCircle(ctx, leftOffset + wFrom + offset, hFrom + offset);
     drawCircle(ctx, leftOffset + wTo - offset, hFrom + offset);
     drawCircle(ctx, leftOffset + wFrom + offset, hTo - offset);
      drawCircle(ctx, leftOffset + wTo - offset, hTo - offset);
*/
     //drawCircle(ctx, wFrom + offset, hFrom + offset);
     //drawCircle(ctx, leftOffset + ((wTo + wFrom) / 2), hFrom + offset);
     //drawCircle(ctx, leftOffset + wFrom + offset, ((hTo + hFrom) / 2));
     //drawCircle(ctx, leftOffset + ((wTo + wFrom) / 2), hTo - offset);
     //drawCircle(ctx, leftOffset + wTo - offset, ((hTo + hFrom) / 2));
     //
     var leftOffset = gamefield.leftOffset;
     var circleSize = Math.round(gamefield.circleSize);
     console.log(circleSize);
     var lineWidth = gamefield.lineWidth;


     // vertices from top left to bottom right
     gamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, hFrom + offset, circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hFrom + offset, circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + wTo - offset, hFrom + offset, circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, ((hTo + hFrom) / 2), circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + wTo - offset, ((hTo + hFrom) / 2), circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, hTo - offset, circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hTo - offset, circleSize));
     gamefield.vertices.push(new Vertex(leftOffset + wTo - offset, hTo - offset, circleSize));

     // von oben links nach unten links
     drawLine(ctx, leftOffset + wFrom + offset, hFrom + offset, leftOffset + wFrom + offset, hTo - offset);
     // von oben links nach oben rechts
     drawLine(ctx, leftOffset + wFrom + offset, hFrom + offset, leftOffset + wTo - offset, hFrom + offset);
     // von oben rechts und nach unten rechts
     drawLine(ctx, leftOffset + wTo - offset, hFrom + offset, leftOffset + wTo - offset, hTo - offset);
     // von unten rechts nach unten links
     drawLine(ctx, leftOffset + wFrom + offset, hTo - offset, leftOffset + wTo - offset, hTo - offset);


  }

  function drawCircle(ctx, posX, posY, size = circleSize) {
     ctx.fillStyle = circleColor;
     ctx.beginPath();
     ctx.arc(posX, posY, circleSize, 0, 2 * Math.PI, false);
     ctx.fill();
     ctx.stroke();
  }

  function drawLine(ctx, xFrom, yFrom, xTo, yTo) {
     ctx.beginPath();
     ctx.moveTo(xFrom, yFrom);
     ctx.lineTo(xTo, yTo);
     ctx.lineWidth = gamefield.lineWidth;
     ctx.stroke();
  }

  initDrawController();

  this.redraw();

}
