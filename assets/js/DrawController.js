function DrawController(canvas, gf, stbar) {
    this.canvas = canvas;
    var gamefield = gf;
    var ctx = canvas.getContext("2d");
    var self = this;
    var redrawAll = false;
    var gameStatusBar = stbar;

    function initDrawController() {
        gameStatusBar.setTextChangedListener(self);

        Vertex.prototype.draw = function(ctx, x, y) {
            ctx.fillStyle = this.fill;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.circleSize, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    this.drawVertex = function(x, y, color) {
        var v = new Vertex(x, y, gamefield.circleSize * 2.5);
        v.fill = color;
        v.draw(ctx, x, y);
    }

    this.redraw = function(redrawA = false) {
        redrawAll = redrawA;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (redrawAll) {
            gamefield.vertices = [];
        }
        drawField();
        drawTokens();
        drawStatusBar();
    }

    this.statusBarTextChanged = function() {
        drawStatusBar();
    }

    function drawTokens() {
        var field = gamefield.field;
        for (var z = 0; z < field.length; z++) {
            for (var y = 0; y < field[0].length; y++) {
                for (var x = 0; x < field[0][0].length; x++) {
                    var pToken = field[z][y][x];
                    if (pToken) {
                        var verts = gamefield.vertices;

                        var v = verts[pToken.vertexId];

                        //console.log(pToken.selected);
                        //console.log(pToken.getColor());
                        // draw selected token
                        if (pToken.selected) {
                            // TODO: fix hardcoded colors
                            if (pToken.getColor() == "hsla(120, 100%, 50%, 1)") {
                                self.drawVertex(v.x, v.y, "hsla(120, 100%, 70%, 1)");
                            } else {
                                self.drawVertex(v.x, v.y, "hsla(0, 100%, 70%, 1)")
                            }

                        }
                        // draw not selected token
                        else {
                            self.drawVertex(v.x, v.y, pToken.getColor());
                        }
                    }
                }
            }
        }
    }

    function drawField() {
        var h = gamefield.height;
        var w = gamefield.width;
        var spaceBetween = gamefield.spaceBetween;
        var leftOffset = gamefield.leftOffset;

        drawFieldPart(ctx, 0, 0, h, w);
        drawFieldPart(ctx, spaceBetween, spaceBetween, h - spaceBetween, w - spaceBetween);
        drawFieldPart(ctx, 2 * spaceBetween, 2 * spaceBetween, h - 2 * spaceBetween, w - 2 * spaceBetween);

        // von links bis mitte
        drawLine(ctx, leftOffset + 0 + 50, ((h + 0) / 2), leftOffset + spaceBetween * 2 + 50, ((h + 0) / 2));
        // von rechts bis mitte
        drawLine(ctx, leftOffset + w - 50, ((h + 0) / 2), leftOffset + w - spaceBetween * 2 - 50, ((h + 0) / 2));

        // von oben bis mitte
        drawLine(ctx, leftOffset + (w / 2), 50, leftOffset + (w / 2), spaceBetween * 2 + 50);
        // von unten bis mitte
        drawLine(ctx, leftOffset + (w / 2), h - 50, leftOffset + (w / 2), h - 50 - spaceBetween * 2);

        for (i = 0; i < gamefield.vertices.length; i++) {
            gamefield.vertices[i].draw(ctx);
            //console.log(gamefield.vertices[i].draw);
        }
    }

    function drawStatusBar() {
        //console.log(gameStatusBar);
        ctx.beginPath();
        ctx.rect(0, gamefield.height - gameStatusBar.height, canvas.width, gamefield.height - gameStatusBar.height);
        ctx.fillStyle = gameStatusBar.backgroundColor;
        ctx.fill();
        ctx.closePath();
        drawStatusBarText();
    }

    function drawStatusBarText() {
        ctx.beginPath();
        ctx.font = "\"" + gameStatusBar.fontSize + " " + gameStatusBar.fontFamily + "\"";
        ctx.fillStyle = gameStatusBar.fontColor;
        ctx.fillText(gameStatusBar.getText(), gamefield.leftOffset, gamefield.height - (gameStatusBar.height / 3));
        ctx.closePath();
    }

    function drawFieldPart(ctx, hFrom, wFrom, hTo, wTo, offset = 50) {
        /*
 drawCircle(ctx, leftOffset + wFrom + offset, hFrom + offset);
     drawCircle(ctx, leftOffset + wTo - offset, hFrom + offset);
     drawCircle(ctx, leftOffset + wFrom + offset, hTo - offset);
      drawCircle(ctx, leftOffset + wTo - offset, hTo - offset);
*/
        //drawCircle(ctx, wFrom + offset, hFrom + offset);
        //drawCircle(ctx, leftOffset + ((wTo + wFrom) / 2), hFrom + offset);
        //drawCircle(ctx, leftOffset + wFrom + offset, ((hTo + hFrom) / 2));
        //drawCircle(ctx, leftOffset + ((wTo + wFrom) / 2), hTo - offset);
        //drawCircle(ctx, leftOffset + wTo - offset, ((hTo + hFrom) / 2));
        //
        var leftOffset = gamefield.leftOffset;
        var circleSize = Math.round(gamefield.circleSize);
        var lineWidth = gamefield.lineWidth;

        //console.log(redrawAll);
        if (redrawAll) {
            // vertices from top left to bottom right
            gamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, hFrom + offset, circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hFrom + offset, circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + wTo - offset, hFrom + offset, circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, ((hTo + hFrom) / 2), circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + wTo - offset, ((hTo + hFrom) / 2), circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, hTo - offset, circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hTo - offset, circleSize));
            gamefield.vertices.push(new Vertex(leftOffset + wTo - offset, hTo - offset, circleSize));
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

    function drawCircle(ctx, posX, posY, size = circleSize) {
        ctx.fillStyle = circleColor;
        ctx.beginPath();
        ctx.arc(posX, posY, circleSize, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
    }


    function drawLine(ctx, xFrom, yFrom, xTo, yTo) {
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);
        ctx.lineTo(xTo, yTo);
        ctx.lineWidth = gamefield.lineWidth;
        ctx.stroke();
    }

    initDrawController();

    this.redraw(true);

}
