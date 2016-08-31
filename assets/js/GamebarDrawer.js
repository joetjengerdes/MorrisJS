/**
 * The GamebarDrawer is used to "draw" the incoming
 * events to the bar to the right of the game
 * @param {GameStatusBar} gbar GameStatusBar which contains
 * the elements
 */
function GamebarDrawer(gbar) {
    // gamestatusbar
    var mGamebar = gbar;
    // add this as a listener to get notified
    // if there are changes
    mGamebar.setTextChangedListener(this);
    // HTMLElement of the sidebar-inner, here is the
    // place where the content goes
    var mSidebar = document.getElementById("sidebar-inner");
    // Image Locations
    var mGeneralImg = "<img src=\"assets/img/flags.png\"></img>";
    var mCpuImg = "<img src=\"assets/img/cpu.png\"></img>";
    var mPlayerImg = "<img src=\"assets/img/player.png\"></img>";

    /**
     * This function is called when the statusbar text
     * changes. It adds the events to it and scrolls to
     * bottom (if there are more events given that the
     * window height can display).
     */
    this.statusBarTextChanged = function() {
        // text to display, which can contains
        // html elements
        var text = "<p>";
        if (mGamebar.isGeneralEvent()) {
            text += mGeneralImg + mGamebar.getText();
        } else {
            var p1 = mGamebar.getPlayerActionFrom();
            var p2 = mGamebar.getPlayerActionAffected();

            if (p1) {
                if (p1.isCPU()) {
                    text = text + mCpuImg;
                } else {
                    text = text + mPlayerImg;
                }
            }
            if (p2) {
                if (p2.isCPU()) {
                    text = text + mCpuImg;
                } else {
                    text = text + mPlayerImg;
                }
            }
            if (!p1 && !p2) {
                return;
            }
            text += mGamebar.getText();

            text = text + "</p>";
        }
        mSidebar.innerHTML += text;
        // autoscroll to bottom
        var sidebarOuter = document.getElementById("sidebar");
        sidebarOuter.scrollTop = sidebarOuter.scrollHeight;
    }

}
