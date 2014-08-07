//The dungeon class is the main class of the game, and handles everything from a surface level
function Dungeon(drawx, drawy, width, height) {
	this.x = drawx || 0;
	this.y = drawy || 0;
	this.width = width || 256;
	this.height = height || 160;

	var rooms = [];
	var current_room; //Only one room at a time is updated and drawn, obviously
	var bound_entity; //The entity which will receive input from the player
	var bound_entity_defupdate; //The default update method for a bound entity. Overridden by manual input and later restored.

	var override_update = function(delta) {
		bound_entity.applyForce(0, 0, delta);
		if(keydown.w) bound_entity.applyForce(0, -1, delta);
		if(keydown.a) bound_entity.applyForce(-1, 0, delta);
		if(keydown.s) bound_entity.applyForce(0, 1, delta);
		if(keydown.d) bound_entity.applyForce(1, 0, delta);
	};

	//Called whenever the game must inform the player of something
	//It should be overridden
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
				bound_entity.x = this.x + this.width / 2 - bound_entity.sprite.width / 2;
				bound_entity.y = this.y + this.height / 2 - bound_entity.sprite.height / 2;
				current_room.entities.push(bound_entity);	
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
	Room.BOUNDARIES = {
		x: 16,
		y: 16,
		x2: 240,
		y2: 144
	};

	var room_bg = room_bg || 'bg_basement';
	var drawx = drawx || 0;
	var drawy = drawy || 0;

	this.draw_overlay = false;
	this.entities = [];

	this.update = function(delta) {
		$.each(this.entities, function(i, e) {
			e.update(delta);
			//Making sure each entity stays within the boundaries
			//Collisions are handled by the Room so that entities themselves stay simple
			if(e.x < Room.BOUNDARIES.x) e.x = Room.BOUNDARIES.x;
			else if(e.x + e.sprite.width > Room.BOUNDARIES.x2) e.x = Room.BOUNDARIES.x2 - e.sprite.width;
			if(e.y < Room.BOUNDARIES.y) e.y = Room.BOUNDARIES.y;
			else if(e.y + e.sprite.height > Room.BOUNDARIES.y2) e.y = Room.BOUNDARIES.y2 - e.sprite.height;
		});
	};

	this.draw = function(canvas) {
		resources[room_bg].draw(canvas, drawx, drawy);
		if(this.draw_overlay) resources['bg_intro_overlay'].draw(canvas, drawx, drawy);
		$.each(this.entities, function(i, e) {
			e.draw(canvas);
		});
	};
};