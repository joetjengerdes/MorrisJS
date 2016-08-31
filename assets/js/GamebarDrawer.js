function GamebarDrawer(gbar) {
    var mGamebar = gbar;
    mGamebar.setTextChangedListener(this);
    var mSidebar = document.getElementById("sidebar-inner");

    var mGeneralImg = "<img src=\"assets/img/flags.png\"></img>";
    var mCpuImg = "<img src=\"assets/img/cpu.png\"></img>";
    var mPlayerImg = "<img src=\"assets/img/player.png\"></img>";

    var mText = "";


    this.statusBarTextChanged = function() {

        var mText = "<p>";
        if (mGamebar.isGeneralEvent()) {
            mText += mGeneralImg + mGamebar.getText();
        } else {
            var p1 = mGamebar.getPlayerActionFrom();
            var p2 = mGamebar.getPlayerActionAffected();

            if (p1) {
                if (p1.isCPU()) {
                    mText = mText + mCpuImg;
                } else {
                    mText = mText + mPlayerImg;
                }
            }
            if (p2) {
                if (p2.isCPU()) {
                    mText = mText + mCpuImg;
                } else {
                    mText = mText + mPlayerImg;
                }
            }
            if (!p1 && !p2) {
                return;
            }
            mText += mGamebar.getText();

            mText = mText + "</p>";
        }
        mSidebar.innerHTML += mText;
        var sidebarOuter = document.getElementById("sidebar");
        sidebarOuter.scrollTop = sidebarOuter.scrollHeight;
    }

}
