function SizeCalculationService(canvas, gamefield) {
  this.gamefield = gamefield;
  this.canvas = canvas;

  function calculate() {
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = Math.max(window.innerHeight, document.body.clientHeight);

    var h = canvas.height;
    var w = canvas.height;

    gamefield.spaceBetween = (h + w) / 12;
    gamefield.circleSize = (h + w) / 180;
    gamefield.lineWidth = (h + w) / 350;
    if (gamefield.circleSize < 1) {
       gamefield.circleSize = 1
    };
    gamefield.leftOffset = (canvas.width - h) / 2;
  }

}
