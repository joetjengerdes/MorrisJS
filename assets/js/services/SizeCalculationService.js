function SizeCalculationService(canvas, gf) {
    this.canvas = canvas;
    var gamefield = gf;

    this.calculate = function() {

        canvas.width = document.body.clientWidth; //document.width is obsolete
        canvas.height = Math.max(window.innerHeight, document.body.clientHeight);

        var canvasHeight = Math.min(window.innerHeight, document.body.clientHeight);

        var size;
        if (canvasHeight <= canvas.width) {
            size = canvasHeight;
        } else {
            size = canvas.width;
        }

        gamefield.height = size;
        gamefield.width = size;

        gamefield.spaceBetween = (2 * size) / 15;
        gamefield.circleSize = (2 * size) / 120;

        gamefield.lineWidth = (2 * size) / 350;
        if (gamefield.circleSize < 1) {
            gamefield.circleSize = 1
        };
        gamefield.leftOffset = (canvas.width - size) / 2;
    }

}
