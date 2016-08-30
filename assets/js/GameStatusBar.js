function GameStatusBar() {
    var mHeight = "20";
    var mText = "Place a stone!";
    var mBackgroundColor = "white";
    var mFontColor = "black";
    var mFontSize = "16px";
    var mFontFamily = "Arial";
    var mTextChangedListener;
    var mGeneralEvent = false;
    var mPlayerActionFrom;
    var mPlayerActionAffected;

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
