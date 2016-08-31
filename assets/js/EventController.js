function EventController(canvas, gamefield) {
    var canvas = canvas;
    var mGameController = null;
    var mDrawController = null;
    var mSizeCalculationService = new SizeCalculationService(canvas, gamefield);
    // timeout used for resizing, so calculation
    // is not done by every frame change
    var mResizeTimeout = null;
    var mMouseMoveTimeout = null;
    var mCursorInRange = false;

    this.setGameController = function(controller) {
        mGameController = controller;
    }

    this.getGameController = function() {
        return mGameController;
    }

    this.setDrawController = function(drawc) {
        mDrawController = drawc;
    }

    this.getDrawController = function() {
        return mDrawController;
    }

    this.getSizeCalculationService = function() {
        return mSizeCalculationService;
    }

    function initController() {
        /*canvas.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        }, false);*/

        $('#game').click(function(e) {
            var mouse = getMouse(e);
            var x = mouse.x;
            var y = mouse.y;

            mGameController.doAction(mouse.x, mouse.y);
        });

        $(window).resize(function() {
            if (mResizeTimeout != null) {
                clearTimeout(mResizeTimeout);
            }
            mResizeTimeout = setTimeout(function() {
                mSizeCalculationService.calculate();
                mDrawController.redraw(true);
                // resizes the statusbox at the bottom
                $('#statusbox').width($('#game').width());
            }, 200);
        });

        $('#game').mousemove(function(e) {
            if (mMouseMoveTimeout != null) {
                clearTimeout(mMouseMoveTimeout);
            }
            mMouseMoveTimeout = setTimeout(function() {
                var mouse = getMouse(e);

                //console.log(self.cursorInRange);

                var beforeCursorinRange = mCursorInRange;
                var markedVertex = null;

                for (var i = 0; i < gamefield.getVertices().length; i++) {
                    var v = gamefield.getVertices()[i];
                    if (v.contains(mouse.x, mouse.y)) {
                        markedVertex = v;
                        mCursorInRange = true;
                    }
                }

                //console.log(markedVertex);
                if (markedVertex != null) {
                    if (!beforeCursorinRange) {
                        mDrawController.redraw(true);
                        mDrawController.drawVertex(markedVertex.getX(), markedVertex.getY(), 'rgba(0,0,0,0.2)');
                    }
                } else {
                    if (beforeCursorinRange) {
                        mCursorInRange = false;
                        mDrawController.redraw(true);
                    }
                }

            }, 5);

        });
        // do first calculation
        mSizeCalculationService.calculate();
    }

    //return relative position to canvas
    function getMouse(e) {
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        var mouseClick = {
            x: x,
            y: y
        }
        return mouseClick;
    }
    initController();
}
