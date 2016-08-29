function GameField() {
    var mWidth = 600;
    var mHeight = 600;
    var mSpaceBetween = 100;
    var mCircleSize = 5;
    var mLineWidth = 5;
    var mLeftOffset = 200; // Offset from left border to gamefield
    var mVertices = [];
    var mField = new Array(3);

    this.getVertices = function() {
        return mVertices;
    }

    this.getField = function() {
        return mField;
    }

    this.getWidth = function() {
        return mWidth;
    }

    this.getHeight = function() {
        return mHeight;
    }

    this.getSpaceBetween = function() {
        return mSpaceBetween;
    }

    this.getCircleSize = function() {
        return mCircleSize;
    }

    this.getLineWidth = function() {
        return mLineWidth;
    }

    this.getLeftOffset = function() {
        return mLeftOffset;
    }

    this.setWidth = function(val) {
        mWidth = val;
    }

    this.setHeight = function(val) {
        mHeight = val;
    }

    this.setSpaceBetween = function(val) {
        mSpaceBetween = val;
    }

    this.setCircleSize = function(val) {
        mCircleSize = val;
    }

    this.setLineWidth = function(val) {
        mLineWidth = val;
    }

    this.setLeftOffset = function(val) {
        mLeftOffset = val;
    }

    this.setVertices = function(val) {
        mVertices = val;
    }

    this.setToDefault = function() {
        mField[0] = [new Array(3), new Array(3), new Array(3)];
        mField[1] = [new Array(3), new Array(3), new Array(3)];
        mField[2] = [new Array(3), new Array(3), new Array(3)];
        mVertices = [];
    }

    this.cloneField = function() {
        var clone = mField.map(function(arr) {
            return arr.map(function(arr2) {
                return arr2.slice(0);
            });
        });
        return clone;
    }

    //    this.setToDefault();
}
