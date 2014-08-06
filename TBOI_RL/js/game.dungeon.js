//The dungeon class is the main class of the game, and handles everything from a surface level
function Dungeon(drawx, drawy) {
	this.x = drawx || 0;
	this.y = drawy || 0;

	var rooms = [];
	var current_room; //Only one room at a time is updated and drawn, obviously
	var bound_entity; //The entity which will receive input from the player

	//Called whenever the game must inform the player of something
	//The suggested use would be to display output directly on the page rather than in the console window
	this.log = function(message) { 
		console.log(message); 
	};

	this.bindent = function(entity) {
		bound_entity = entity;
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
				current_room = new Room(this.x, this.y);
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