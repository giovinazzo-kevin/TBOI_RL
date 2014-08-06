//The GUI provides info on current health
function GUI(x, y, width, height) {
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 100;
	this.height = height || 100;

	var bound_entity; //The entity from which data will be gathered

	this.bindent = function(entity) {
		bound_entity = entity;
	};

	this.draw = function(canvas) {
		canvas.fillStyle = '#1A1917';
		canvas.fillRect(this.x, this.y, this.width, this.height);
	};
}