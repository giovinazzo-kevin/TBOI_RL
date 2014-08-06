function GameCore(width, height) {
	this.width = width;
	this.height = height;
	this.framesPerSecond = 30;

	this.update = $.noop;
	this.draw = $.noop;

    var core_init = function(g) {
		var canvasElement = $("<canvas width='" + g.width + "' height='" + g.height + "'>Your browser doesn't seem to support HTML5 canvases.</canvas>");
		var canvas = canvasElement.get(0).getContext("2d");
		canvasElement.appendTo('body');
		setInterval(function() {
			g.update(1000 / g.framesPerSecond);
			g.draw(canvas);
		}, 1000 / g.framesPerSecond);
	};

	core_init(this);
};

resources = {
	'bg_basement' : new Sprite('bg_basement'),
	'bg_intro_overlay' : new Sprite('bg_intro_overlay'),

	'gui_halfheart' : new Sprite('spritesheet', 0, 0, 4, 8),
	'gui_fullheart' : new Sprite('spritesheet', 0, 0, 8, 8),
	'gui_emptyheart' : new Sprite('spritesheet', 8, 0, 8, 8),
	'gui_halfsoulheart' : new Sprite('spritesheet', 0, 8, 4, 8),
	'gui_fullsoulheart' : new Sprite('spritesheet', 0, 8, 8, 8),
	'gui_halfeternalheart' : new Sprite('spritesheet', 8, 8, 4, 8),
	'gui_fulleternalheart' : new Sprite('spritesheet', 8, 8, 8, 8),
	'gui_key' : new Sprite('spritesheet', 16, 0, 8, 8),
	'gui_skeletonkey' : new Sprite('spritesheet', 24, 0, 8, 8),
	'gui_coin' : new Sprite('spritesheet', 16, 8, 8, 8),
	'gui_bomb' : new Sprite('spritesheet', 24, 8, 8, 8),
	'gui_slot' : new Sprite('spritesheet', 0, 16, 18, 18),
	'gui_arrowr' : new Sprite('spritesheet', 20, 16, 12, 5),
	'gui_arrowl' : new Sprite('spritesheet', 20, 21, 12, 5),

	'ent_sprite_default' : new Sprite('spritesheet', 48, 0, 16, 16),
	'ent_sprite_isaac' : new Sprite('spritesheet', 48, 16, 16, 16),
};