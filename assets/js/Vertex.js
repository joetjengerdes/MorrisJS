/**
 * Vertex is a field where a token can be placed
 * it can have at max 1 token on it. It has
 * coordinates where it is and a size
 * @param {Integer} x          x coordinate of the vertex
 * @param {Integer} y          y coordinate of the vertex
 * @param {Int} circleSize size of the vertex
 */
function Vertex(x, y, circleSize) {
    // coordinates of the vertex
    var mX = x;
    var mY = y;
    // size of the vertex
    var mCircleSize = circleSize;
    // fill color of the vertex, default is black
    var mFill = '#000000';

    /**
     * Gets the x coordinate of the vertex
     * @return {Integer} x coordinate
     */
    this.getX = function() {
        return mX;
    };

    /**
     * Gets the y coordinate of the vertex
     * @return {Integer} y coordinate
     */
    this.getY = function() {
        return mY;
    };

    /**
     * Gets the size of the vertex
     * @return {Integer} the size
     */
    this.getCircleSize = function() {
        return mCircleSize;
    };

    /**
     * Sets the fill color
     * @param {String} color the fill color
     */
    this.setFill = function(color) {
        mFill = color;
    };

    /**
     * Gets the fill color
     * @return {String} the fill color
     */
    this.getFill = function() {
        return mFill;
    };

    /**
     * Checks if there is a vertex on the given coordinates
     * @param  {Integer} mx x coordinate to check
     * @param  {Integer} my y coordinate to check
     * @return {Boolean}    true if there is a vertex, false otherwise
     */
    this.contains = function(mx, my) {
        var factor = 2.5;
        if ((mX - mCircleSize * factor) < mx && (mX + mCircleSize * factor) > mx) {
            if ((mY - mCircleSize * factor) <= my && (mY + mCircleSize * factor) >= my) {
                return true;
            }
        }
        return false;
    };

}
