/**
 * SizeCalculationService is used to calculate
 * the gamefield size etc.
 * @param {HTMLElement} canvas the canvas
 * @param {GameField} gf     the gamefield
 */
function SizeCalculationService(canvas, gf) {
    var mCanvas = canvas;
    var mGamefield = gf;

    /**
     * this function recalculates all values of
     * the gamefield etc.
     */
    this.calculate = function() {
        var gamefield = document.getElementById("gamefield");
        var topNav = document.getElementById("topnav");
        var sidebar = document.getElementById("sidebar");

        mCanvas.width = document.body.clientWidth - sidebar.offsetWidth;
        mCanvas.height = gamefield.clientHeight - topNav.clientHeight;

        //var mCanvasHeight = Math.min(window.innerHeight, document.body.clientHeight);

        var mCanvasHeight = mCanvas.height;

        var size;
        if (mCanvasHeight <= mCanvas.width) {
            size = mCanvasHeight;
        } else {
            size = mCanvas.width;
        }

        mGamefield.setHeight(size);
        mGamefield.setWidth(size);

        mGamefield.setSpaceBetween((2 * size) / 15);
        mGamefield.setCircleSize((2 * size) / 120);

        mGamefield.setLineWidth((2 * size) / 350);
        if (mGamefield.getCircleSize() < 1) {
            mGamefield.setCircleSize(1);
        }
        mGamefield.setLeftOffset((mCanvas.width - size) / 2);
    };

}
