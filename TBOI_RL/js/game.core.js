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

function PlayMusic(filename) {
	$('#audiosrc').attr('src', filename);
	var audio = $('#audioplayer');
	audio[0].pause();
    audio[0].load();
    audio[0].play();
};

function PauseMusic() {
	var audio = $('#audioplayer');
	audio[0].pause();
};

function ResumeMusic() {
	var audio = $('#audioplayer');
	audio[0].play();
};

function Distance2D(e1, e2) {
	var x1 = e1.x + e1.sprite.width / 2;
	var y1 = e1.y + e1.sprite.height / 2;
	var x2 = e2.x + e2.sprite.width / 2;
	var y2 = e2.y + e2.sprite.height / 2;
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

//Called whenever the game must inform the player of something
//It should be overridden
function Log(message) { 
	console.log(message); 
};

function Animation(frames, interval) {
	this.frames = frames;
	this.interval = interval;
	this.width = frames[0].width;
	this.height = frames[0].height;
	var elapsed = 0;
	var frame = 0;
	this.onCompletion = $.noop,
	this.update = function(delta) {
		elapsed += delta;
		if(elapsed >= interval) {
			elapsed = 0;
			frame++;
			this.width = frames[frame % (frames.length - 1)].width;
			this.height = frames[frame % (frames.length - 1)].height;
			if(frame == frames.length - 1) this.onCompletion();
		}
	};
	this.draw = function(canvas, x, y) { 
		frames[frame % (frames.length - 1)].draw(canvas, x, y);
	};
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

	'ent_sprite_door_normal' : new Sprite('spritesheet', 2, 16, 28, 16),
	'ent_sprite_bomb' : new Sprite('spritesheet', 0, 64, 16, 16),
	'ent_frames_bomb_primed' : [
		new Sprite('spritesheet', 16, 64, 16, 16),
		new Sprite('spritesheet', 32, 64, 16, 16),
		new Sprite('spritesheet', 48, 64, 16, 16),
		new Sprite('spritesheet', 64, 64, 16, 16),
	], 
	'ent_frames_bomb_boom' : [ 
		new Sprite('spritesheet', 16, 80, 16, 16),
		new Sprite('spritesheet', 32, 80, 16, 16),
		new Sprite('spritesheet', 48, 80, 16, 16),
		new Sprite('spritesheet', 64, 80, 16, 16),
	], 

	'ent_sprite_default' : new Sprite('spritesheet', 48, 0, 16, 16),
	'ent_sprite_isaac' : new Sprite('spritesheet', 48, 16, 16, 16),
	'ent_sprite_blackfly' : new Sprite('spritesheet', 64, 0, 16, 16),

	'misc_holy_beam' : new Sprite('spritesheet', 224, 0, 32, 152),
	'misc_death_page' : new Sprite('death_page'),

	'music_basement' : './sounds/music/penance.mp3',
};