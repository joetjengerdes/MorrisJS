/**
 * The event controller is events caused by
 * the user, e.g. resizing the windows or
 * doing clicks.
 * @param {HTMLElement} canvas    the canvas of the game
 * @param {Gamefield} gamefield gamefield of the game
 */
function EventController(canvas, gamefield) {
    // canvas of the game
    var mCanvas = canvas;
    // reference of the gamecontroller
    var mGameController = null;
    // reference of the drawController
    var mDrawController = null;
    // create service for recalculations of the gamefield
    var mSizeCalculationService = new SizeCalculationService(mCanvas, gamefield);
    // timeout used for resizing, so calculation
    // is not done by every frame change
    var mResizeTimeout = null;
    // timeout for mouse moving, so it is not refreshed by every frame
    var mMouseMoveTimeout = null;
    // flag if the cursor is in range of a token, if it stays there
    // this variable stays true
    var mCursorInRange = false;

    /**
     * Sets a gamecontroller
     * @param {GameController} controller a game controller
     */
    this.setGameController = function(controller) {
        mGameController = controller;
    };


    /**
     * Gets the game controller
     * @return {GameController} the gamecontroller
     */
    this.getGameController = function() {
        return mGameController;
    };

    /**
     * Sets a drawcontroller
     * @param {GameController} drawc a drawcontroller
     */
    this.setDrawController = function(drawc) {
        mDrawController = drawc;
    };

    /**
     * Gets the drawcontroller
     * @return {DrawController} the drawcontroller
     */
    this.getDrawController = function() {
        return mDrawController;
    };

    /**
     * Gets the service for gamefield calculations
     * @return {SizeCalculationService} the service
     */
    this.getSizeCalculationService = function() {
        return mSizeCalculationService;
    };

    /**
     * initializes the controller, in this function all
     * handlers are added to the inputs which belong to the game
     */
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
            if (mResizeTimeout !== null) {
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
            if (mMouseMoveTimeout !== null) {
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
                if (markedVertex !== null) {
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

    /**
     * This function return the relative mouse-position of
     * the canvas
     * @param  {Event} e the event of the mouse
     * @return {Object}   Object which contains the x and y coordinates
     */
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
        x -= mCanvas.offsetLeft;
        y -= mCanvas.offsetTop;

        var mouseClick = {
            x: x,
            y: y
        };
        return mouseClick;
    }
    initController();
}
