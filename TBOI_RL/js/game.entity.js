function Entity() {
	Entity.MAX_HEALTH = 20;
	Entity.FRICTION = 0.77;

	this.ignoresBoundaries = false;
	this.controlledByHuman = false;
	this.name = 'Unnamed Entity';
	this.sprite = resources['ent_sprite_default'];
	this.damagesOnTouch = false;
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
		if(this.damagesOnTouch) e.takeDamage(this, 0.5);
	};

	this.knockback = function(away_from, strength, duration) {
		var angle = Math.atan2(this.y - away_from.y, this.x - away_from.x);
		this.applyForce(Math.cos(angle) * strength, Math.sin(angle) * strength, duration);
	};

	this.bursttowards = function(towards, strength, duration) {
		var angle = -Math.atan2(this.y - towards.y, this.x - towards.x);
		this.applyForce(Math.cos(angle) * strength, Math.sin(angle) * strength, duration);
	};

	this.takeDamage = function(attacker, damage, knockback) {
		knockback = knockback || true;

		if(this.info.soulhearts > 0)
			this.info.soulhearts = Math.max(this.info.soulhearts - damage, 0);
		else
			this.info.health = Math.max(this.info.health - damage, 0);

		//Apply knockback
		if(knockback) this.knockback(attacker, damage * 10, 20);

		if(this.info.health == 0) {
			this.onDeath(attacker);
			this.takeDamage = $.noop;
		};
	};

	this.onDeath = function(killer) {

	};

	this.update = function(entities, delta) {
		this.applyForce(0, 0, delta);
	};

	this.draw = function(canvas) {
		this.sprite.draw(canvas, this.x, this.y);
	};
};
//Functional entities (Bombs, rocks, chests...)
function ent_Bomb() {
	Entity.call(this);
	this.name = 'Bomb';
	this.primeTime = 1200;
	this.areaOfEffect = 48;
	this.damage = 1;
	this.sprite = new Animation(resources['ent_frames_bomb_primed'], 100);

	//Bombs don't give a shit
	this.knockback = $.noop;

	this.update = function(entities, delta) {
		this.applyForce(0, 0, delta);
		this.sprite.update(delta); //It's an animation, remember.
	};

	var bomb = this;
	var id = setInterval(function() { bomb.explode(); }, bomb.primeTime);
	this.explode = function() {
		clearInterval(id);
		this.sprite = new Animation(resources['ent_frames_bomb_boom'], 100);
		bomb.update = function(entities, delta) {
			//PROCEED TO DEAL AOE DAMAGE
			$.each(entities, function(i, e) {
				if(e == bomb) return;
				var dist = Distance2D(e, bomb);
				if(dist <= bomb.areaOfEffect) { 
					e.takeDamage(bomb, bomb.damage);
				}			
			});
			bomb.update = function(entities, delta){this.sprite.update(delta);};
		};

		bomb.sprite.onCompletion = function() {
			bomb.sprite = resources['ent_sprite_bomb'];
			bomb.dead = true;
		};
	}

};
ent_Bomb.prototype = new Entity;
//Alive entities (Enemies, playable characters...)

function ent_Fly() {
	Entity.call(this);
	this.name = 'Black Fly';
	this.sprite = resources['ent_sprite_blackfly'];
	this.damage = 0.5;
	this.damagesOnTouch = true;
	this.x = 40;
	this.y = 40;

	this.update = function(entities, delta) {
		this.applyForce(0, 0, delta);
		//Find closest entity that is controlledByHuman
		var closest;
		$.each(entities, function(i, e) {
			if(e == this) return;
			dist = Distance2D(this, e);
			if(!closest || dist < Distance2D(closest)) closest = e;
		});

		if(closest) this.bursttowards(closest, 10, 20);
	};
};
ent_Fly.prototype = new Entity;

function ent_Isaac() {
	Entity.call(this);
	this.name = 'Isaac';
	this.sprite = resources['ent_sprite_isaac'];
};
ent_Isaac.prototype = new Entity;