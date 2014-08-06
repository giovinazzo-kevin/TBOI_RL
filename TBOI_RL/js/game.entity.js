function Entity() {
	this.name = 'Unnamed Entity';
	this.sprite = new Sprite('spritesheet', 48, 0, 16, 16); //'no_ent' sprite
	this.info = {
		health: 4,
		maxhealth: 4,
		coins: 0,
		keys: 0,
		bombs: 0
	};

	this.update = function(delta) {

	};

	this.draw = function(canvas) {

	};
}

function ent_Isaac() {
	Entity.call(this);
	this.name = 'Isaac';
	this.sprite = new Sprite('spritesheet', 48, 16, 16, 16); //'isaac' sprite
}
ent_Isaac.prototype = new Entity;