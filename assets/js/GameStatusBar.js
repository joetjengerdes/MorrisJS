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
    // the listeners which should be notified by change
    var mTextChangedListener = [];
    // the player which did the action
    var mPlayerActionFrom;
    // the player wihch is affected by the action
    var mPlayerActionAffected;

    // the type of the event. It can be 'error', 'general', 'actionDone',
    // 'doAction'. Whereas error represents errors like you tried to remove
    // an enemy token, general is for game events like 'game started', 'actionDone'
    // is for the history and 'doAction' is what the player has to do next
    var mEventType;

    /**
     * Sets the text and notfies the listener about the change
     * @param {String} newText text which should be printed
     * @param {Boolean} general true if it is a general event like "win"
     * @param {Player} player1 player which did the action, undefinied if it is general
     * @param {Player} player2 player which is affected by the action, undefinied
     * if there is none affected
     */
    this.setText = function(newText, eventType, player1, player2) {
        mText = newText;
        mEventType = eventType;
        mPlayerActionFrom = player1;
        mPlayerActionAffected = player2;

        for (var i = 0; i < mTextChangedListener.length; i++) {
            mTextChangedListener[i].statusBarTextChanged();
        }
    }

    this.isGeneralEvent = function() {
        return mEventType == 'general';
    }

    this.isDoActionEvent = function() {
        return mEventType == 'doAction';
    }

    this.isActionDoneEvent = function() {
        return mEventType == 'actionDone';
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

    this.addTextChangedListener = function(listener) {
        mTextChangedListener.push(listener);
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
