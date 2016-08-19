/**
 * handles the user input
 */
function InputController(canvas) {
  this.canvas = canvas;
  this.selectetion = null;
  

  this.initController = function() {
    canvas.addEventListener('mousedown', function(e) {
      var mouse = controller.getMouse(e);
      controller.doAction(mouse);
    });
    canvas.addEventListener('selectstart', function(e) {
       e.preventDefault();
       return false;
    }, false);
  }

  this.getMouse = function(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    var mouseClick = {
      x: x,
      y: y
    }
    return mouseClick;
  }

  this.initController();

}
