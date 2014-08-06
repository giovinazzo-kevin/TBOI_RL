//Dungeon is a wrapper of an array of rooms that handles updating, switching room, etc.
function Dungeon() {
	var rooms = [];

	//Called whenever the game must inform the player of something
	//The suggested use would be to display output directly on the page rather than in the console window
	this.log = function(message) { 
		console.log(message); 
	};
	
	this.init = function() {
		this.log("Initializing dungeon...");
	};

	this.update = function(delta) {
		
	};

	this.draw = function(canvas) {
		
	};

}

function Room() {
	var tiles = [];
	var entities = [];
	var items = [];

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

Room.background = new Sprite("background");