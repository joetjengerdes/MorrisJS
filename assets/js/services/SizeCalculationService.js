function SizeCalculationService(canvas, gf) {
    var mCanvas = canvas;
    var mGamefield = gf;

    this.calculate = function() {

        mCanvas.width = document.body.clientWidth; //document.getWidth() is obsolete
        mCanvas.height = Math.max(window.innerHeight, document.body.clientHeight);

        var mCanvasHeight = Math.min(window.innerHeight, document.body.clientHeight);

        var size;
        if (mCanvasHeight <= mCanvas.width) {
            size = mCanvasHeight;
        } else {
            size = mCanvas.getWidth();
        }

        mGamefield.setHeight(size);
        mGamefield.setWidth(size);

        mGamefield.setSpaceBetween((2 * size) / 15);
        mGamefield.setCircleSize((2 * size) / 120);

        mGamefield.setLineWidth((2 * size) / 350);
        if (mGamefield.getCircleSize() < 1) {
            mGamefield.setCircleSize(1);
        };
        mGamefield.setLeftOffset((mCanvas.width - size) / 2);
    }

}
