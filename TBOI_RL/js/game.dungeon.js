//The dungeon class is the main class of the game, and handles everything from a surface level
function Dungeon(drawx, drawy) {
	this.x = drawx || 0;
	this.y = drawy || 0;

	var rooms = [];
	var current_room; //Only one room at a time is updated and drawn, obviously
	var bound_entity; //The entity which will receive input from the player
	var bound_entity_defupdate; //The default update method for a bound entity. Overridden by manual input and later restored.

	var override_update = function(delta) {

	};

	//Called whenever the game must inform the player of something
	//The suggested use would be to display output directly on the page rather than in the console window
	this.log = function(message) { 
		console.log(message); 
	};

	this.bindent = function(entity) {
		if(bound_entity && bound_entity_defupdate) bound_entity.update = bound_entity_defupdate;
		bound_entity = entity;
		bound_entity_defupdate = bound_entity.update;
		bound_entity.update = override_update;
	};
	
	this.init = function() {
		this.log('Initializing dungeon...');
		this.log('&nbsp;&nbsp;&nbsp;&nbsp;... Done.');
	};

	this.gen = function(type) {
		this.log('Generating dungeon...');
		type = type || 'basement';
		//TODO: Actually add generation code
		switch(type) {
			case 'basement':
			default:
				current_room = new Room('bg_basement', this.x, this.y);
				current_room.draw_overlay = true;
			break;
		};
		this.log('&nbsp;&nbsp;&nbsp;&nbsp;... Done.');
	};

	this.update = function(delta) {
		current_room.update(delta);
	};

	this.draw = function(canvas) {
		current_room.draw(canvas);
	};

};

function Room(room_bg, drawx, drawy) {
	var room_bg = room_bg || 'bg_basement';
	var drawx = drawx || 0;
	var drawy = drawy || 0;

	this.draw_overlay = false;
	this.tiles = [];
	this.entities = [];
	this.items = [];

	this.update = function(delta) {
		//Tiles don't need to update individually
		$.each(this.entities, function(index) {
			this.entities[i].update(delta);
		});
		$.each(this.items, function(index) {
			this.items[i].update(delta);
		});
	};

	this.draw = function(canvas) {
		resources[room_bg].draw(canvas, drawx, drawy);
		if(this.draw_overlay) resources['bg_intro_overlay'].draw(canvas, drawx, drawy);
		$.each(this.tiles, function(index) {
			this.tiles[i].draw(delta);
		});
		$.each(this.entities, function(index) {
			this.entities[i].draw(delta);
		});
		$.each(this.items, function(index) {
			this.items[i].draw(delta);
		});
	};
};