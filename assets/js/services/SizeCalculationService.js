function SizeCalculationService(canvas, gf) {
  this.canvas = canvas;
  var gamefield = gf;
  console.log(gf);
  console.log(gamefield);

  this.calculate = function() {
    //console.log(this.gamefield);

    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = Math.max(window.innerHeight, document.body.clientHeight);


  //  var h = canvas.height;
  //  var w = h;
    var canvasHeight = Math.min(window.innerHeight, document.body.clientHeight);

    var size;
    if(canvasHeight <= canvas.width) {
      size = canvasHeight;
    }
    else {
      size = canvas.width;
    }

    //console.log("Height: " + h);
    //console.log(w);
    //console.log(canvas.width);

    gamefield.height = size;
    gamefield.width = size;

    gamefield.spaceBetween = (2*size) / 15;
    gamefield.circleSize = (2*size) / 120;

    gamefield.lineWidth = (2*size) / 350;
    if (gamefield.circleSize < 1) {
       gamefield.circleSize = 1
    };
    gamefield.leftOffset = (canvas.width - size) / 2;

    console.log(gamefield);
  }

}
