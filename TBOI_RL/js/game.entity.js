function Entity() {
	Entity.MAX_HEALTH = 20;
	Entity.FRICTION = 0.77;

	this.name = 'Unnamed Entity';
	this.sprite = resources['ent_sprite_default'];
	this.info = {
		health: 4,
		maxhealth: 4,
		soulhearts: 0,
		eternalhearts: 0,
		coins: '00',
		keys: '00',
		bombs: '00'
	};
	this.speed = {
		x: 0.0009,
		y: 0.0009
	};

	this.x = 0;
	this.y = 0;

	//Current velocity
	this.velocity_x = 0;
	this.velocity_y = 0;
	//Velocity data from the last call to applyForce
	this.applyForce = function(accel_x, accel_y, dt) {
		this.x += this.velocity_x * dt;
		this.y += this.velocity_y * dt;
		this.velocity_x = Entity.FRICTION * (this.velocity_x + (this.speed.x * accel_x) * dt);
		this.velocity_y = Entity.FRICTION * (this.velocity_y + (this.speed.y * accel_y) * dt);
	};

	this.collides = function(e2) {
		var r1 = {
			left: this.x,
			right: this.x + this.sprite.width,
			top: this.y,
			bottom: this.y + this.sprite.height
		};
		var r2 = {
			left: e2.x,
			right: e2.x + e2.sprite.width,
			top: e2.y,
			bottom: e2.y + e2.sprite.height
		};

		return !(r2.left > r1.right || 
	           r2.right < r1.left || 
	           r2.top > r1.bottom ||
	           r2.bottom < r1.top);
	};

	this.onCollision = function(e) {
		this.takeDamage(e, 0.5);
	};

	this.takeDamage = function(attacker, damage) {
		if(this.info.soulhearts > 0)
			this.info.soulhearts = Math.min(this.info.soulhearts - damage, 0);
		else
			this.info.health = Math.min(this.info.health - damage, 0);
		
		if(this.info.health == 0)
			this.onDeath(attacker);
	};

	this.onDeath = function(killer) {

	};

	this.update = function(delta) {

	};

	this.draw = function(canvas) {
		this.sprite.draw(canvas, this.x, this.y);
	};
};
//Functional entities (Bombs, rocks, chests...)
function ent_Bomb() {
	Entity.call(this);
	this.name = 'Bomb';
	this.sprite = resources['ent_sprite_bomb'];
	this.update = function(delta) {

	};
};
ent_Bomb.prototype = new Entity;
//Alive entities (Enemies, playable characters...)
function ent_Isaac() {
	Entity.call(this);
	this.name = 'Isaac';
	this.sprite = resources['ent_sprite_isaac'];
};
ent_Isaac.prototype = new Entity;
