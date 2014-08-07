function Entity() {
	Entity.MAX_HEALTH = 20;
	Entity.FRICTION = 0.90;

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
		x: 0.00033,
		y: 0.00033
	};

	this.x = 0;
	this.y = 0;

	//Current velocity
	var velocity_x = 0;
	var velocity_y = 0;
	this.applyForce = function(accel_x, accel_y, dt) {
		this.x += velocity_x * dt;
		this.y += velocity_y * dt;
		velocity_x = Entity.FRICTION * (velocity_x + (this.speed.x * accel_x) * dt);
		velocity_y = Entity.FRICTION * (velocity_y + (this.speed.y * accel_y) * dt);
	};

	this.onCollision = function(e) {

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
	this.sprite = resources['ent_sprite_isaac'];
};
ent_Bomb.prototype = new Entity;
//Alive entities (Enemies, playable characters...)
function ent_Isaac() {
	Entity.call(this);
	this.name = 'Isaac';
	this.sprite = resources['ent_sprite_isaac'];
};
ent_Isaac.prototype = new Entity;
