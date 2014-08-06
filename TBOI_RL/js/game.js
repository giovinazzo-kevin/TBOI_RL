$(function() {
	var game = new GameCore(356, 160);
	var dungeon = new Dungeon();

	var init = function() {
		//Overriding dungeon.log so that the output is visible instead of printed to the console
		dungeon.log = function(message) {
			$('<p class="game_log">' + message + '</p>').appendTo('body');
		};
		dungeon.init();
	};

	game.update = function(delta) {
		dungeon.update(delta);
	};

	game.draw = function(canvas) {
		//Clear the buffer
		canvas.fillStyle = colors.cornflowerblue;
		canvas.fillRect(0, 0, this.width, this.height);
		//Let the main classes handle the drawing
		dungeon.draw(canvas);
	};

	init();
});