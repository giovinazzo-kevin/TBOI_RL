//The dungeon class is the main class of the game, and handles everything from a surface level
function Dungeon() {
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
				current_room = new Room();
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

}

function Room() {
	var tiles = [];
	var entities = [];
	var items = [];

	Room.background = new Sprite('room_bg');

	this.update = function(delta) {
		//Tiles don't need to update individually
		$.each(entities, function(index) {
			entities[i].update(delta);
		});
		$.each(items, function(index) {
			items[i].update(delta);
		});
	}

	this.draw = function(canvas) {
		$.each(tiles, function(index) {
			tiles[i].draw(delta);
		});
		$.each(entities, function(index) {
			entities[i].draw(delta);
		});
		$.each(items, function(index) {
			items[i].draw(delta);
		});
	}
}