//The dungeon class is the main class of the game, and handles everything from a surface level
function Dungeon(drawx, drawy, width, height) {
	this.x = drawx || 0;
	this.y = drawy || 0;
	this.width = width || 256;
	this.height = height || 160;


	var DOOR = {
		NONE : 'none',
		NORMAL : 'map_doornormal_',
	};

	var rooms = [];
	var doors = {
		left: DOOR.NORMAL,
		right: DOOR.NORMAL,
		up: DOOR.NORMAL,
		down: DOOR.NORMAL	
	};
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
		//Draw the doors
		if(doors.left != DOOR.NONE) resources[doors.left + 'left'].draw(canvas, 0, this.y + this.height / 2 - resources[doors.left + 'left'].height / 2);
		if(doors.right != DOOR.NONE) resources[doors.right + 'right'].draw(canvas, this.x + this.width - resources[doors.right + 'right'].width, this.y + this.height / 2 - resources[doors.right + 'right'].height / 2);
		if(doors.up != DOOR.NONE) resources[doors.up + 'up'].draw(canvas, this.x + this.width / 2 - resources[doors.up + 'up'].width / 2, 0);
		if(doors.down != DOOR.NONE)  resources[doors.down + 'down'].draw(canvas, this.x + this.width / 2 - resources[doors.down + 'down'].width / 2, this.y + this.height - resources[doors.down + 'down'].height) ;
	};

};

function Room(room_bg, drawx, drawy) {
	var room_bg = room_bg || 'bg_basement';
	var drawx = drawx || 0;
	var drawy = drawy || 0;

	this.draw_overlay = false;
	this.entities = [];
	this.items = [];

	this.update = function(delta) {
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
		$.each(this.entities, function(index) {
			this.entities[i].draw(delta);
		});
		$.each(this.items, function(index) {
			this.items[i].draw(delta);
		});
	};
};