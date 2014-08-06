function Entity() {
	this.name = "Unnamed";
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
}
ent_Isaac.prototype = new Entity;