
function Tile(sprite, issolid) {
	this.sprite = sprite;
	this.solid = issolid;

	this.update = $.noop;

	this.draw = function(canvas, x, y) {
		this.sprite.draw(canvas, x, y);
	};
}
Tile.ground = 	new Tile(new Sprite("tileset", 0, 0, 16, 16), false);
Tile.wall = 	new Tile(new Sprite("tileset", 16, 0, 16, 16), true);
Tile.doorl = 	new Tile(new Sprite("tileset", 32, 0, 16, 16), true);
Tile.doorr = 	new Tile(new Sprite("tileset", 48, 0, 16, 16), true);
Tile.dooru = 	new Tile(new Sprite("tileset", 64, 0, 16, 16), true);
Tile.doord = 	new Tile(new Sprite("tileset", 80, 0, 16, 16), true);
Tile.rock = 	new Tile(new Sprite("tileset", 96, 0, 16, 16), true);
Tile.chestn = 	new Tile(new Sprite("tileset", 112, 0, 16, 16), true);
Tile.chestg = 	new Tile(new Sprite("tileset", 128, 0, 16, 16), true);

//Dungeon class
function Dungeon(width, height) {
	var tiles = [];
	var nchests = 0;
	this.gen = function() {
		for (var i = 0; i < width; i++) {
			tiles[i] = [];
			for (var j = 0; j < height; j++) {
				var rand = Math.floor(Math.random() * 10);
				var rand2 = Math.floor(Math.random() * 200);
				if(i == 0 || i == width - 1 || j == 0 || j == height - 1)
					tiles[i][j] = Tile.wall;
				else if(rand == 1)
					tiles[i][j] = Tile.rock;
				else if(nchests < 3 && rand2 == 1){
					tiles[i][j] = Tile.chestn;
					nchests++;
				}
				else if(nchests < 3 && rand2 == 2){
					tiles[i][j] = Tile.chestg;
					nchests++;
				}
				else
					tiles[i][j] = Tile.ground;

			};
		};
	};

	this.at = function(x, y, set) {
		var i = parseInt(x / 16);
		var j = parseInt(y / 16) - 1;
		if(set) tiles[i][j] = set;
		return tiles[i][j];
	};

	this.update = $.noop;
	this.draw = function(canvas, xoffset, yoffset) {
		xoffset = xoffset || 0;
		yoffset = yoffset || 0;

		for (var i = 0; i < tiles.length; i++) {
			for (var j = 0; j < tiles[i].length; j++) {
				tiles[i][j].draw(canvas, xoffset + i * 16, yoffset + j * 16);
			};
		};
	}
}
//HUD class
function HUD(height) {
	this.life = 4;
	this.maxlife = 4;
	this.keys = 0;
	this.bombs = 0;

	var s_fullheart = new Sprite("hud", 0, 0, 16, 16);
	var s_emptyheart = new Sprite("hud", 16, 0, 16, 16);
	var s_key = new Sprite("hud", 32, 0, 16, 16);
	var s_bomb = new Sprite("hud", 48, 0, 16, 16);

	this.update = function(player, delta) {
		this.life = player.life;
		this.maxlife = player.maxlife;
		this.keys = player.keys;
		this.bombs = player.bombs;
	}

	this.draw = function(canvas) {
		canvas.fillStyle = colors.black;
		canvas.font = "16px Arial";
		//draw life
		for (var i = 0; i < this.maxlife; i++) {
			if(i < this.life) s_fullheart.draw(canvas, i + i * s_fullheart.width, 0);
			else s_emptyheart.draw(canvas, i + i * s_fullheart.width, 0);
		};
		//draw keys
		var margin = 16 * this.maxlife + 16;
		canvas.fillText(this.keys, margin, 14);
	    var twidth = canvas.measureText(this.keys).width;
		s_key.draw(canvas, margin + twidth, 0);
		//draw bombs
		margin += 16 + twidth;
		canvas.fillText(this.bombs, margin, 14);
		twidth = canvas.measureText(this.bombs).width;
		s_bomb.draw(canvas, margin + twidth, 0);
	}
}
//Bullet class
function Bullet(x, y, speedx, speedy) {
	this.x = x;
	this.y = y;
	this.reach = 5;
	this.dead = false;

	var traversed = 0;
	var popped = false;
	var anim_speed = 100;
	var sprites = [ 
		new Sprite("hud", 0, 48, 16, 16),
		new Sprite("hud", 16, 48, 16, 16),
		new Sprite("hud", 32, 48, 16, 16),
		new Sprite("hud", 48, 48, 16, 16),
		new Sprite("hud", 0, 64, 16, 16),
		new Sprite("hud", 16, 64, 16, 16),
		new Sprite("hud", 32, 64, 16, 16),
		new Sprite("hud", 48, 64, 16, 16),
	];
	var cursprite = 0;

	var anim_elapsed = 0;
	this.update = function(room, delta) {
		if(!this.dead) {
			anim_elapsed += delta;
			if(anim_elapsed >= anim_speed) {
				anim_elapsed = 0;
				cursprite = (cursprite + 1) % 4;
			}
			if(!popped) {
				traversed += speedx / 16 + speedy / 16;
				this.x += speedx;
				this.y += speedy;
			}

			if(!popped && (traversed >= this.reach || room.at(this.x + Math.floor(sprites[cursprite].width / 2), this.y + Math.floor(sprites[cursprite].height / 2)).solid)) {
				popped = true;
				anim_speed /= 4;
				cursprite = 0;
			}
		}
	};

	this.draw = function(canvas) {
		if(!this.dead) {
			if(!popped)
				sprites[cursprite].draw(canvas, this.x, this.y);
			else if(cursprite <= 3) {
				sprites[cursprite + 4].draw(canvas, this.x, this.y);
			}
			if(popped && cursprite == 3) {
				this.dead = true;
			}
		}
	};
}
//Bomb class
function Bomb(x, y) {
	this.x = x;
	this.y = y;
	this.dead = false;
	var anim_speed = 100;
	var prime_duration = 2400;
	var exploding = false;
	var cursprite = 0;
	var sprites = [
		new Sprite("hud", 0, 80, 16, 16),
		new Sprite("hud", 16, 80, 16, 16),
		new Sprite("hud", 32, 80, 16, 16),
		new Sprite("hud", 48, 80, 16, 16),

		new Sprite("hud", 0, 96, 16, 16),
		new Sprite("hud", 16, 96, 16, 16),
		new Sprite("hud", 32, 96, 16, 16),
		new Sprite("hud", 48, 96, 16, 16)
	];
	var anim_elapsed = 0;

	var explode = function(x, y, room)
	{
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				var tx = x + i * 16;
				var ty = y + j * 16;
				if(room.at(tx, ty) == Tile.rock) {
					room.at(tx, ty, Tile.ground);
				}
			};
		};
	}

	this.update = function(room, delta) {
		if(!this.dead) {
			anim_elapsed += delta;
			if(anim_elapsed >= anim_speed) {
				anim_elapsed = 0;	
				if(!exploding) 
					cursprite = (cursprite + 1) % 4;
				else {
					cursprite = (cursprite + 1) % 4 + 4;
					if(cursprite == 4) {
						this.dead = true;
						explode(this.x, this.y, room);
					}
				}
			}
		}
	}

	this.draw = function(canvas) {
		if(!this.dead) {
			if(!exploding) 
				sprites[cursprite].draw(canvas, this.x, this.y);
			else
			{
				for (var i = -1; i <= 1; i++) {
					for (var j = -1; j <= 1; j++) {
						sprites[cursprite].draw(canvas, this.x + i * 16, this.y + j * 16);
					}
				}
			}
		}
	}

	setInterval(function() {
		exploding = true;
		anim_speed /= 2;
		cursprite = 0;
	}, prime_duration);

}
//Enemy class
function Enemy() {
	
}
//Player class
function Player() {
	this.life = 4;
	this.maxlife = 4;
	this.keys = 1;
	this.bombs = 1;

	this.x = 0;
	this.y = 0;

	this.walkspeed = 1;
	this.shootspeed = 1;

	this.bulletspeed = 4;

	var bullets = [];
	var bombs = [];

	var sprites = [
		new Sprite("hud", 0, 16, 16, 16),
		new Sprite("hud", 16, 16, 16, 16),
		new Sprite("hud", 32, 16, 16, 16),
		new Sprite("hud", 48, 16, 16, 16),
		new Sprite("hud", 0, 32, 16, 16),
		new Sprite("hud", 16, 32, 16, 16),
		new Sprite("hud", 32, 32, 16, 16),
		new Sprite("hud", 48, 32, 16, 16),
	];

	var cursprite = sprites[0];

	var directions = {
		"down": 0,
		"up": 1,
		"right": 2,
		"left": 3
	};

	var walk_elapsed = 1000;
	var shoot_elapsed = 1000;
	var spriteoffset = 0;
	var walking = false;

	var walk = function(player) {
		walk_elapsed = 0;
		walking = true;
		var interval = setInterval(function() {
			clearInterval(interval);
			walking = false;
		}, 320 * 0.8);
	}

	var openchest = function(room, x, y) {
		var chest = room.at(x, y);
		if(chest  == Tile.chestn) {
		} else if(chest  == Tile.chestg) {

		}
		room.at(x, y, Tile.ground);
	}

	var old_bomb;
	this.update = function(room, delta) {

		for (var i = bullets.length - 1; i >= 0; i--) {
			bullets[i].update(room, delta);
			if(bullets[i].dead) bullets.splice(i, 1);
		};

		for (var i = bombs.length - 1; i >= 0; i--) {
			bombs[i].update(room, delta);
			if(bombs[i].dead) bombs.splice(i, 1);
		};

		walk_elapsed += delta;
		shoot_elapsed += delta;

		if(walk_elapsed >= 320 / this.walkspeed) {
			if(keydown.a) {
				if((sprites.indexOf(cursprite) - spriteoffset) != directions.left)
				{
					walk_elapsed = 320 - 120;
				}
				else if(!room.at(this.x - 16, this.y).solid) {
					walk(this);
				}  else if(this.keys > 0 && (room.at(this.x - 16, this.y) == Tile.chestn || room.at(this.x - 16, this.y) == Tile.chestg)) {
					this.keys--;
					openchest(room, this.x - 16, this.y);
				}
				cursprite = sprites[spriteoffset + directions.left];
			}
			else if(keydown.d) {
				if((sprites.indexOf(cursprite) - spriteoffset) != directions.right)
				{
					walk_elapsed = 320 - 120;
				}
				else if(!room.at(this.x + 16, this.y).solid) {
					walk(this);
				} else if(this.keys > 0 && (room.at(this.x + 16, this.y) == Tile.chestn || room.at(this.x + 16, this.y) == Tile.chestg)) {
					this.keys--;
					openchest(room, this.x + 16, this.y);
				}
				cursprite = sprites[spriteoffset + directions.right];
			}
			else if(keydown.w) {
				if((sprites.indexOf(cursprite) - spriteoffset) != directions.up)
				{
					walk_elapsed = 320 - 120;
				}
				else if(!room.at(this.x, this.y - 16).solid) {
					walk(this);
				} else if(this.keys > 0 && (room.at(this.x, this.y - 16) == Tile.chestn || room.at(this.x, this.y - 16) == Tile.chestg)) {
					this.keys--;
					openchest(room, this.x, this.y - 16);
				}
				cursprite = sprites[spriteoffset + directions.up];
			}
			else if(keydown.s) {
				if((sprites.indexOf(cursprite) - spriteoffset) != directions.down)
				{
					walk_elapsed = 320 - 120;
				}
				else if(!room.at(this.x, this.y + 16).solid) {
					walk(this);
				} else if(this.keys > 0 && (room.at(this.x, this.y + 16) == Tile.chestn || room.at(this.x, this.y + 16) == Tile.chestg)) {
					this.keys--;
					openchest(room, this.x, this.y + 16);
				}
				cursprite = sprites[spriteoffset + directions.down];
			}
		}

		var shoot = function() {
			spriteoffset = 4;
			cursprite = sprites[sprites.indexOf(cursprite) + spriteoffset];
			shoot_elapsed = 0;
			var interval = setInterval(function() {
				cursprite = sprites[sprites.indexOf(cursprite) - spriteoffset];
				spriteoffset = 0;
				clearInterval(interval);
			}, 640 / 2 / this.shootspeed);
		}

		if(shoot_elapsed >= 640 / this.shootspeed) {
			if(keydown.left) {
				bullets.push(new Bullet(this.x, this.y, -this.bulletspeed, 0));
				shoot();
			}
			else if(keydown.right) {
				bullets.push(new Bullet(this.x, this.y, this.bulletspeed, 0));
				shoot();
			}
			else if(keydown.up) {
				bullets.push(new Bullet(this.x, this.y, 0, -this.bulletspeed));
				shoot();
			}
			else if(keydown.down) {
				bullets.push(new Bullet(this.x, this.y, 0, this.bulletspeed));
				shoot();
			}
		}

		if(this.bombs > 0 && keydown.e && !old_bomb) {
			this.bombs--;
			bombs.push(new Bomb(this.x, this.y));
		}

		if(walking) {
			var sw = sprites.indexOf(cursprite) % 4;
			switch(sw) {
				case directions.left:
					this.x -= 2;
				break;
				case directions.right:
					this.x += 2;
				break;
				case directions.up:
					this.y -= 2;
				break;
				case directions.down:
					this.y += 2;
				break;
			}
		}

		old_bomb = keydown.e;
	}

	this.draw = function(canvas) {
		for (var i = bombs.length - 1; i >= 0; i--) {
			bombs[i].draw(canvas);
		};
		for (var i = bullets.length - 1; i >= 0; i--) {
			bullets[i].draw(canvas);
		};
		cursprite.draw(canvas, this.x, this.y);
	}
}

//Hajimemashou
$(function() {
	var header = 16;
	var game = new GameCore(256, 176 + header);
	var room = new Dungeon(game.width / 16, (game.height - header) / 16);
	room.gen();
	var player = new Player();
	player.x = 16;
	player.y = 16 + header;
	room.at(player.x, player.y, Tile.ground);
	var hud = new HUD(header);

	game.update = function(delta) {
		hud.update(player, delta);
		player.update(room, delta);
	};

	game.draw = function(canvas) {
		canvas.fillStyle = colors.darkgray;
		canvas.fillRect(0, 0, game.width, game.height);
		room.draw(canvas, 0, header);
		hud.draw(canvas);
		player.draw(canvas);	
	};
});
