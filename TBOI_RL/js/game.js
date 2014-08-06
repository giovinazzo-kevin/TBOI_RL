$(function() {
	var game = new GameCore(356, 160);

	//ACTOR: A particular entity which gets bound to the Dungeon. It's not special in any way.
	var actor = new ent_Isaac();
	//DUNGEON: Manages rooms
	// + ROOMS: Manage entities, items and tiles
	var dungeon = new Dungeon(0, 0, 256, 160);
	//GUI: Pools together data from an entity and its inventory and draws it on screen.
	var gui = new GUI(game.width - 100, 0, 100, game.height);

	var init = function() {
		//Overriding dungeon.log so that the output is visible instead of printed to the console
		dungeon.log = function(message) {
			$('<br><span class="game_log">' + message + '</span>').appendTo('body');
		};
		dungeon.init();
		dungeon.bindent(actor); //"actor" will now receive input data from the player
		gui.bindent(actor); //gui will default to showing "actor"'s data.
		dungeon.gen(); //Finally, generate the dungeon.
	};

	game.update = function(delta) {
		dungeon.update(delta);
	};

	game.draw = function(canvas) {
		//Clear the buffer
		canvas.fillStyle = '#FFF';
		canvas.fillRect(0, 0, this.width, this.height);
		//Let the main classes handle the drawing
		dungeon.draw(canvas);
		gui.draw(canvas);
	};

	init();
});