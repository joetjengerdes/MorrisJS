function Vertex(x, y, circleSize) {
    var mX = x;
    var mY = y;
    var mCircleSize = circleSize;
    var mFill = '#000000';

    this.getX = function() {
        return mX;
    }

    this.getY = function() {
        return mY;
    }

    this.getCircleSize = function() {
        return mCircleSize;
    }

    this.setFill = function(color) {
        mFill = color;
    }
    this.getFill = function() {
        return mFill;
    }

    this.contains = function(mx, my) {
        var factor = 2.5;
        if ((mX - mCircleSize * factor) < mx && (mX + mCircleSize * factor) > mx) {
            if ((mY - mCircleSize * factor) <= my && (mY + mCircleSize * factor) >= my) {
                return true;
            }
        }
        return false;
    }

}
