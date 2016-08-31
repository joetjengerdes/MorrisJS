/**
 * The SoundController is used to play sounds
 */
function SoundController() {

    // name of html entities for the audios
    const MOVE_SOUND_HTML_ID = "click";
    const TOKEN_STEAL_HTML_ID = "clickoff";

    // the elements for sound playing
    var moveElem = document.getElementById(MOVE_SOUND_HTML_ID);
    var tokenElem = document.getElementById(TOKEN_STEAL_HTML_ID);

    /**
     * This function plays the sound for a 'move'
     */
    this.playMoveSound = function() {
        moveElem.pause();
        moveElem.currentTime = 0;
        moveElem.play();
    };

    /**
     * This function plays the sound if s.o. lost a token
     */
    this.playTokenStealSound = function() {
        tokenElem.pause();
        tokenElem.currentTime = 0;
        tokenElem.play();
    };

}
