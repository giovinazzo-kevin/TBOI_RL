//The GUI provides info on current health
function GUI() {
	var bound_entity; //The entity from which data will be gathered

	this.bindent = function(entity) {
		bound_entity = entity;
	};
	
	this.update = function(delta) {
		//current_room.update(delta);
	};

	this.draw = function(canvas) {
		//current_room.draw(delta);
	};
}