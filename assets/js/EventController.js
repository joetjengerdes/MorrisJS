function EventController(canvas) {
	
	canvas.addEventListener('click', function(e) {
	var mouse = this.getMouse(e);
	var x = mouse.x;
	var y = mouse.y;
		
		
	});
	
	//return relative position to canvas
	function getMouse(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
}