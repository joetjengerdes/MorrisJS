function SizeCalculationService(canvas, gf) {
  this.canvas = canvas;
  var gamefield = gf;
  console.log(gf);
  console.log(gamefield);

  this.calculate = function() {
    //console.log(this.gamefield);

    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = Math.max(window.innerHeight, document.body.clientHeight);

    var h = canvas.height;
    var w = canvas.height;


    gamefield.spaceBetween = (h + w) / 15;
    gamefield.circleSize = (h + w) / 120;

    gamefield.lineWidth = (h + w) / 350;
    if (gamefield.circleSize < 1) {
       gamefield.circleSize = 1
    };
    gamefield.leftOffset = (canvas.width - h) / 2;

    console.log(gamefield);
  }

}
