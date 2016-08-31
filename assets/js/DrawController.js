/**
 * The draw controller is used to draw on the canvas. It draws the gamefield
 * and all tokens on in
 * @param {HTMLElement} canvas the canvas to draw on
 * @param {Gamefield} gf     the gamefield where the tokens are on
 */
function DrawController(canvas, gf) {
    // the canvas on which is drawn
    var mCanvas = canvas;
    // the gamefield where the vertices and tokens are on
    var mGamefield = gf;
    // context to draw
    var mCtx = mCanvas.getContext("2d");
    // self reference
    var self = this;
    // flag if everything should be redrawn, full redraw
    // includes the vertices (points), where players place
    // their tokens on
    var mRedrawAll = false;
    //var mGameStatusBar = stbar;

    /**
     * initializes the controller, vertices get an draw function
     * so that they can get painted
     */
    function initDrawController() {
        Vertex.prototype.draw = function(ctx) {
            ctx.fillStyle = this.getFill();
            ctx.beginPath();
            ctx.arc(this.getX(), this.getY(), this.getCircleSize(), 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    /**
     * Draws a vertex on the given coordiantes with the
     * given color
     * @param  {Integer} x     x coordinate of the vertex
     * @param  {Integer} y     y coordinate of the vertex
     * @param  {String} color color of the vertex
     */
    this.drawVertex = function(x, y, color) {
        var v = new Vertex(x, y, mGamefield.getCircleSize() * 2.5);
        v.setFill(color);
        v.draw(mCtx);
    }

    /**
     * Redraws the gamefield, if the parameter is applied
     * with true, a full redraw is done. Full redraw redraws
     * all points and lines.
     * @param  {Boolean} [redrawA=false] true if a full redraw, otherwise false
     */
    this.redraw = function(redrawA = false) {
        mRedrawAll = redrawA;
        mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
        if (mRedrawAll) {
            mGamefield.setVertices([]);
        }
        drawField();
        drawTokens();
    }

    /**
     * Draws all player tokens from both players.
     */
    function drawTokens() {
        var field = mGamefield.getField();
        for (var z = 0; z < field.length; z++) {
            for (var y = 0; y < field[0].length; y++) {
                for (var x = 0; x < field[0][0].length; x++) {
                    var pToken = field[z][y][x];
                    if (pToken) {
                        var verts = mGamefield.getVertices();

                        var v = verts[pToken.getVertexIndex()];

                        if (pToken.isSelected()) {
                            self.drawVertex(v.getX(), v.getY(),
                                pToken.getPlayer().getHighlightingColor())
                        }
                        // draw not selected token
                        else {
                            self.drawVertex(v.getX(), v.getY(), pToken.getColor());
                        }
                    }
                }
            }
        }
    }

    /**
     * Draws the gamefield, this includes lines and points
     */
    function drawField() {
        var h = mGamefield.getHeight();
        var w = mGamefield.getWidth();
        var spaceBetween = mGamefield.getSpaceBetween();
        var leftOffset = mGamefield.getLeftOffset();
        var offset = 60;

        drawFieldPart(mCtx, 0, 0, h, w);
        drawFieldPart(mCtx, spaceBetween, spaceBetween, h - spaceBetween, w - spaceBetween);
        drawFieldPart(mCtx, 2 * spaceBetween, 2 * spaceBetween, h - 2 * spaceBetween, w - 2 * spaceBetween);

        // von links bis mitte
        drawLine(mCtx, leftOffset + 0 + offset, ((h + 0) / 2), leftOffset + spaceBetween * 2 + offset, ((h + 0) / 2));
        // von rechts bis mitte
        drawLine(mCtx, leftOffset + w - offset, ((h + 0) / 2), leftOffset + w - spaceBetween * 2 - offset, ((h + 0) / 2));

        // von oben bis mitte
        drawLine(mCtx, leftOffset + (w / 2), offset, leftOffset + (w / 2), spaceBetween * 2 + offset);
        // von unten bis mitte
        drawLine(mCtx, leftOffset + (w / 2), h - offset, leftOffset + (w / 2), h - offset - spaceBetween * 2);

        for (i = 0; i < mGamefield.getVertices().length; i++) {
            mGamefield.getVertices()[i].draw(mCtx);
            //console.log(gamefield.getVertices()[i].draw);
        }
    }

    /*function drawStatusBar() {
        //console.log(gameStatusBar);
        mCtx.beginPath();
        mCtx.rect(0, mGamefield.getHeight() - mGameStatusBar.getHeight(), mCanvas.width, mGamefield.getHeight() - mGameStatusBar.getHeight());
        mCtx.fillStyle = mGameStatusBar.getBackgroundColor();
        mCtx.fill();
        mCtx.closePath();
        drawStatusBarText();
    }*/

    /*
    function drawStatusBarText() {
        mCtx.beginPath();
        mCtx.font = "\"" + mGameStatusBar.getFontSize() + " " +
            mGameStatusBar.getFontFamily() + "\"";
        mCtx.fillStyle = mGameStatusBar.getFontColor();
        mCtx.fillText(mGameStatusBar.getText(), mGamefield.getLeftOffset(),
            mGamefield.getHeight() - (mGameStatusBar.getHeight() / 3));
        mCtx.closePath();
    }*/

    /**
     * Draws a part of the field, a part is a "ring".
     * @param  {Context} ctx         the context to draw on
     * @param  {Integer} hFrom       ring from
     * @param  {Integer} wFrom       ring from
     * @param  {Integer} hTo         ring to
     * @param  {Integer} wTo         ring to
     * @param  {Number} [offset=50] Offset between the other "rings"
     */
    function drawFieldPart(ctx, hFrom, wFrom, hTo, wTo, offset = 60) {

        var leftOffset = mGamefield.getLeftOffset();
        var circleSize = Math.round(mGamefield.getCircleSize());
        var lineWidth = mGamefield.getLineWidth();

        if (mRedrawAll) {
            // vertices from top left to bottom right
            mGamefield.getVertices().push(new Vertex(leftOffset + wFrom + offset, hFrom + offset, circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hFrom + offset, circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + wTo - offset, hFrom + offset, circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + wFrom + offset, ((hTo + hFrom) / 2), circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + wTo - offset, ((hTo + hFrom) / 2), circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + wFrom + offset, hTo - offset, circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hTo - offset, circleSize));
            mGamefield.getVertices().push(new Vertex(leftOffset + wTo - offset, hTo - offset, circleSize));
        }

        // von oben links nach unten links
        drawLine(ctx, leftOffset + wFrom + offset, hFrom + offset, leftOffset + wFrom + offset, hTo - offset);
        // von oben links nach oben rechts
        drawLine(ctx, leftOffset + wFrom + offset, hFrom + offset, leftOffset + wTo - offset, hFrom + offset);
        // von oben rechts und nach unten rechts
        drawLine(ctx, leftOffset + wTo - offset, hFrom + offset, leftOffset + wTo - offset, hTo - offset);
        // von unten rechts nach unten links
        drawLine(ctx, leftOffset + wFrom + offset, hTo - offset, leftOffset + wTo - offset, hTo - offset);


    }

    /**
     * Draws a line
     * @param  {Context} ctx         the context to draw on
     * @param  {Integer} xFrom       line from
     * @param  {Integer} yFrom       line from
     * @param  {Integer} xTo         line to
     * @param  {Integer} yTo         line to
     */
    function drawLine(ctx, xFrom, yFrom, xTo, yTo) {
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);
        ctx.lineTo(xTo, yTo);
        ctx.lineWidth = mGamefield.getLineWidth();
        ctx.stroke();
    }

    // initliazes the controller by calling the function
    initDrawController();

    // do a full redraw after initialization
    this.redraw(true);

}
