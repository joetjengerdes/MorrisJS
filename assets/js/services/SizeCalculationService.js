function SizeCalculationService(canvas, gf) {
    var mCanvas = canvas;
    var mGamefield = gf;

    this.calculate = function() {

        mCanvas.width = document.body.clientWidth; //document.width is obsolete
        mCanvas.height = Math.max(window.innerHeight, document.body.clientHeight);

        var mCanvasHeight = Math.min(window.innerHeight, document.body.clientHeight);

        var size;
        if (mCanvasHeight <= mCanvas.width) {
            size = mCanvasHeight;
        } else {
            size = mCanvas.width;
        }

        mGamefield.height = size;
        mGamefield.width = size;

        mGamefield.spaceBetween = (2 * size) / 15;
        mGamefield.circleSize = (2 * size) / 120;

        mGamefield.lineWidth = (2 * size) / 350;
        if (mGamefield.circleSize < 1) {
            mGamefield.circleSize = 1
        };
        mGamefield.leftOffset = (mCanvas.width - size) / 2;
    }

}
