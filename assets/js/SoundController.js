function SoundController() {

    const MOVE_SOUND_HTML_ID = "click";
    const TOKEN_STEAL_HTML_ID = "clickoff";

    var moveElem = document.getElementById(MOVE_SOUND_HTML_ID);
    var tokenElem = document.getElementById(TOKEN_STEAL_HTML_ID);

    this.playMoveSound = function() {
        moveElem.play();
    }

    this.playTokenStealSound = function() {
        tokenElem.play();
    }

}
