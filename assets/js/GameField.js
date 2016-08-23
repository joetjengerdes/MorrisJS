function GameField() {
    this.width = 600;
    this.height = 600;
    this.spaceBetween = 100;
    this.circleSize = 5;
    this.lineWidth = 5;
    this.leftOffset = 200; // Offset from left border to gamefield
    this.vertices = [];
    this.field;

    this.setToDefault = function() {
        this.field = [
            [new Array(3), new Array(3), new Array(3)],
            [new Array(3), new Array(3), new Array(3)],
            [new Array(3), new Array(3), new Array(3)]
        ];
        this.vertices = [];
    }

    this.cloneField = function() {
        var clone = this.field.map(function(arr) {
            return arr.map(function(arr2) {
                return arr2.slice(0);
            });
        });
        return clone;
    }

    this.setToDefault();
}
