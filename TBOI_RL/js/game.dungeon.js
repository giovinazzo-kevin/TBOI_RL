//The dungeon class is the main class of the game, and handles everything from a surface level
function Dungeon(drawx, drawy, width, height) {
	this.x = drawx || 0;
	this.y = drawy || 0;
	this.width = width || 256;
	this.height = height || 160;

	var rooms = [];
	var current_room; //Only one room at a time is updated and drawn, obviously
	var bound_entity; //The entity which will receive input from the player

	this.update = function(delta) {
		current_room.update(delta);
	};

	this.draw = function(canvas) {
		current_room.draw(canvas);
	};

	this.gameOver = function(ent_killer) {
		var base_draw = this.draw;
		this.draw = (function() {
			return function(canvas) {
				base_draw.apply(this, arguments);
				var page = resources['misc_death_page'],
				px = this.x + this.width / 2,
				py = this.y + this.height / 2;
				canvas.save();
				canvas.translate(px, py);
				canvas.rotate(0.15);
				px = -(page.width / 2);
				py = -(page.height / 2);
				//Draw page
				page.draw(canvas, px, py);
				//Draw text
				canvas.fillStyle = "rgb(180, 170, 169)";
				canvas.font = 'bold 10px "Segoe Script"';
				canvas.fillText(" DEAR DIARY, ", px + 5, py + 11);
				canvas.fillText("   TODAY I DIED. ", px + 5, py + 22);
				canvas.font = 'bold 8px "Segoe Script"';
				canvas.fillText("I WAS KILLED BY THIS", px + 5, py + 33);
				canvas.fillText(" THING", px + 5, py + 42);
				canvas.fillText(current_room.death_desc1, px + 5, py + 55);
				canvas.fillText(current_room.death_desc2, px + 5, py + 63);
				canvas.font = 'bold 7px "Segoe Script"';
				canvas.fillText("I LEAVE ALL THAT I OWN", px + 5, py + 83);
				canvas.font = 'bold 8px "Segoe Script"';
				canvas.fillText("TO MY CAT GUPPY", px + 5, py + 91);
				canvas.font = 'bold 7px "Segoe Script"';
				canvas.fillText("GOODBYE CRUEL WORLD", px + 5, py + 114);
				canvas.font = 'bold 8px "Segoe Script"';
				canvas.fillText("               XOXO " + bound_entity.name.toUpperCase(), px + 5, py + 122);
				//Draw killer
				ent_killer.sprite.draw(canvas, px + 72, py + 48);
				canvas.restore();
			};
		}());
	};

	this.spawn = function(entity) {
		current_room.entities.push(entity);
	};

	//Called whenever the game must inform the player of something
	//It should be overridden
	this.log = function(message) { 
		console.log(message); 
	};

	this.bindent = function(entity) {
		var dungeon = this;
		bound_entity = entity;
		//Replace update with a more convenient method
		bound_entity.update = function(delta) {
		bound_entity.applyForce(0, 0, delta);
			var multiplier = 1;
			//If moving diagonally, penalize the movement accordingly
			if((keydown.w || keydown.s) && (keydown.a || keydown.d)) multiplier /= Math.sqrt(2);
			if(keydown.w) bound_entity.applyForce(0, -multiplier, delta);
			if(keydown.a) bound_entity.applyForce(-multiplier, 0, delta);
			if(keydown.s) bound_entity.applyForce(0, multiplier, delta);
			if(keydown.d) bound_entity.applyForce(multiplier, 0, delta);
		};
		//This is basically the death animation
		bound_entity.onDeath = function(killer) {
			var darkscreen = new Entity();
			//Fade effect
			darkscreen.transparency = 0;
			darkscreen.update = function(delta) {
				if(this.transparency < 0.4) {
					this.transparency += 0.001 * delta;
				}
			};
			darkscreen.draw = function(canvas) {
				canvas.fillStyle = "rgba(0, 0, 0, " + this.transparency + ")";
				canvas.fillRect(dungeon.x, dungeon.y, dungeon.width, dungeon.height);
			};
			//Beam doesn't fade
			var holybeam = new Entity();
			var beam_x = bound_entity.x - bound_entity.sprite.width / 2;
			var beam_y = dungeon.y - dungeon.height + bound_entity.y + bound_entity.sprite.height * 2;
			holybeam.draw = function(canvas) {
				resources['misc_holy_beam'].draw(canvas, beam_x, beam_y);
			};
			//Spawn screen and beam so they are updated and drawn
			dungeon.spawn(darkscreen);
			dungeon.spawn(holybeam);
			//Replace entity's update and draw with a death animation
			var elapsed = 0;
			bound_entity.transparency = 1;
			bound_entity.update = function(delta) {
				this.x += Math.sin((elapsed += delta)) * 1;
				if(this.transparency > 0.1) {
					this.transparency -= 0.001 * delta;
				} else {
					this.update = $.noop;
					this.draw = $.noop;
					//Death anim is over, we can safely call the GG screen
					dungeon.gameOver(killer);
				}
			};
			bound_entity.draw = function(canvas) {
				canvas.globalAlpha = this.transparency;
				this.sprite.draw(canvas, this.x, this.y);
				canvas.globalAlpha = 1;
			};
			//Respawn player so that he's in front of everything else
			current_room.entities.splice(0, 1);
			dungeon.spawn(bound_entity);
		};
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
				current_room.draw_overlay = true;
				bound_entity.x = this.x + this.width / 2 - bound_entity.sprite.width / 2;
				bound_entity.y = this.y + this.height / 2 - bound_entity.sprite.height / 2;
				this.spawn(bound_entity);
			break;
		};
		this.log('&nbsp;&nbsp;&nbsp;&nbsp;... Done.');
	};
};

function Room(drawx, drawy) {
	Room.BOUNDARIES = {
		x: 16,
		y: 16,
		x2: 240,
		y2: 144
	};

	this.background = resources['bg_basement'];
	this.death_desc1 = "  IN SOME";
	this.death_desc2 = "BASEMENT";

	var drawx = drawx || 0;
	var drawy = drawy || 0;

	this.draw_overlay = false;
	this.entities = [];

	this.update = function(delta) {
		var ents = this.entities;
		$.each(ents, function(i, e) {
			e.update(delta);
			//Making sure each entity stays within the boundaries
			if(e.x < Room.BOUNDARIES.x) e.x = Room.BOUNDARIES.x;
			else if(e.x + e.sprite.width > Room.BOUNDARIES.x2) e.x = Room.BOUNDARIES.x2 - e.sprite.width;
			if(e.y < Room.BOUNDARIES.y) e.y = Room.BOUNDARIES.y;
			else if(e.y + e.sprite.height > Room.BOUNDARIES.y2) e.y = Room.BOUNDARIES.y2 - e.sprite.height;
		
			//Collisions are handled by the Room so that entities themselves stay simple
			//Collision checks for each entity pairing
			$.each(ents, function(j, e2) {
				if(e2 == e) return;
				if(e.collides(e2)) e.onCollision(e2);				
			});
		});
	};

	this.draw = function(canvas) {
		this.background.draw(canvas, drawx, drawy);
		if(this.draw_overlay) resources['bg_intro_overlay'].draw(canvas, drawx, drawy);
		$.each(this.entities, function(i, e) {
			e.draw(canvas);
		});
	};
};