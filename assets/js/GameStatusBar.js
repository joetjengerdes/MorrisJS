/**
 * The GameStatusBar holds a bunch of values which is used
 * by the drawers and the game
 */
function GameStatusBar() {
    var mHeight = "20";
    var mText = "Place a stone!";
    var mBackgroundColor = "white";
    var mFontColor = "black";
    var mFontSize = "16px";
    var mFontFamily = "Arial";
    // a general event is "win", "lose", etc.
    var mGeneralEvent = false;
    // the listener which should be notified by change
    var mTextChangedListener;
    // the player which did the action
    var mPlayerActionFrom
        // the player wihch is affected by the action
    var mPlayerActionAffected;

    /**
     * Sets the text and notfies the listener about the change
     * @param {String} newText text which should be printed
     * @param {Boolean} general true if it is a general event like "win"
     * @param {Player} player1 player which did the action, undefinied if it is general
     * @param {Player} player2 player which is affected by the action, undefinied
     * if there is none affected
     */
    this.setText = function(newText, general, player1, player2) {
        mText = newText;
        mGeneralEvent = general;
        mPlayerActionFrom = player1;
        mPlayerActionAffected = player2;

        if (mTextChangedListener) {
            mTextChangedListener.statusBarTextChanged();
        }
    }

    this.isGeneralEvent = function() {
        return mGeneralEvent;
    }

    this.getPlayerActionFrom = function() {
        return mPlayerActionFrom;
    }

    this.getPlayerActionAffected = function() {
        return mPlayerActionAffected;
    }

    this.getActionDescription = function() {
        return mDescription;
    }

    this.getText = function() {
        return mText;
    }

    this.setTextChangedListener = function(listener) {
        mTextChangedListener = listener;
    }

    this.getHeight = function() {
        return mHeight;
    }

    this.getBackgroundColor = function() {
        return mBackgroundColor;
    }

    this.getFontColor = function() {
        return mFontColor;
    }

    this.getFontSize = function() {
        return mFontSize;
    }

    this.getFontFamily = function() {
        return mFontFamily;
    }

    this.setHeight = function(height) {
        mHeight = height;
    }

    this.setBackgroundColor = function(bgc) {
        mBackgroundColor = bgc;
    }

    this.setFontColor = function(fontColor) {
        mFontColor = fontColor;
    }

    this.setFontSize = function(fontsize) {
        if (fontsize < 0) {
            throw "must be greater equal 0";
        }
        mFontSize = fontsize;
    }

    this.setFontFamily = function(fontfamily) {
        mFontFamily = fontfamily;
    }

}
