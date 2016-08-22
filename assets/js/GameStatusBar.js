function GameStatusBar() {
    this.height = "20";
    text = "Place a stone!";
    this.backgroundColor = "white";
    this.fontColor = "black";
    this.fontSize = "16px";
    this.fontFamily = "Arial";

    var textChangedListener;

    this.setText = function(newText) {
        text = newText;
        console.log(newText);
        //console.log(listener);
        if (textChangedListener) {
            textChangedListener.statusBarTextChanged();
            //console.log(textChangedListener);
        }
    }

    this.getText = function() {
        return text;
    }

    this.setTextChangedListener = function(listener) {
        textChangedListener = listener;
    }
}
