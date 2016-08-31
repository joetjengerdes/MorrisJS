/**
 * Gamefield represents the gamefield of the game, it holds
 * datas for the size, the vertices and a field. The field
 * is a 3d array of tokens
 */
function GameField() {
    // size of the gamefield
    var mWidth = 600;
    var mHeight = 600;
    // space between the rings
    var mSpaceBetween = 100;
    var mCircleSize = 5;
    var mLineWidth = 5;
    // Offset from left border to gamefield
    var mLeftOffset = 200;
    // all vertices of the game, vertices are the place
    // where tokens can be placed
    var mVertices = [];
    var mField = new Array(3);

    this.getVertices = function() {
        return mVertices;
    };

    this.getField = function() {
        return mField;
    };

    this.getWidth = function() {
        return mWidth;
    };

    this.getHeight = function() {
        return mHeight;
    };

    this.getSpaceBetween = function() {
        return mSpaceBetween;
    };

    this.getCircleSize = function() {
        return mCircleSize;
    };

    this.getLineWidth = function() {
        return mLineWidth;
    };

    this.getLeftOffset = function() {
        return mLeftOffset;
    };

    this.setWidth = function(val) {
        mWidth = val;
    };

    this.setHeight = function(val) {
        mHeight = val;
    };

    this.setSpaceBetween = function(val) {
        mSpaceBetween = val;
    };

    this.setCircleSize = function(val) {
        mCircleSize = val;
    };

    this.setLineWidth = function(val) {
        mLineWidth = val;
    };

    this.setLeftOffset = function(val) {
        mLeftOffset = val;
    };

    this.setVertices = function(val) {
        mVertices = val;
    };

    this.setToDefault = function() {
        mField[0] = [new Array(3), new Array(3), new Array(3)];
        mField[1] = [new Array(3), new Array(3), new Array(3)];
        mField[2] = [new Array(3), new Array(3), new Array(3)];
        //mVertices = [];
    };


    /**
     * cloneField - clones the Field of GameField or clones the field in the parameter.
     *
     * @param  {type} field field to clone or undefinded
     * @return {type}       cloned field.
     */
    this.cloneField = function(field) {
        if (!field) {
            field = mField;
        }
        var clone = field.map(function(arr) {
            return arr.map(function(arr2) {
                return arr2.slice(0);
            });
        });
        return clone;
    };

    //    this.setToDefault();
}
