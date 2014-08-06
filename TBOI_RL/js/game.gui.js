//The GUI provides info on current health
function GUI(drawx, drawy, width, height) {
	this.x = drawx || 0;
	this.y = drawy || 0;
	this.width = width || 100;
	this.height = height || 100;

	var bound_entity; //The entity from which data will be gathered

	this.bindent = function(entity) {
		bound_entity = entity;
	};

	//Used for coins, bombs and keys
	var draw_icon = function(canvas, icon, text, x, y) {
		icon.draw(canvas, x, y);
		x += icon.width;
		canvas.fillText(text, x, y + icon.height);
		x += canvas.measureText(text).width;

		return { x: x, y: y };
	};

	this.draw = function(canvas) {
		canvas.fillStyle = '#1a1917';
		canvas.fillRect(this.x, this.y, this.width, this.height);
		canvas.fillStyle = '#636363';
		canvas.font = 'bold 10px Verdana';
		//Draw coins, bombs and keys
		var ret = draw_icon(canvas, resources['gui_coin'], ' ' + bound_entity.info.coins + ' ', this.x + 4, this.y + 3);
		ret = draw_icon(canvas, resources['gui_bomb'], ' ' + bound_entity.info.bombs+ ' ', ret.x, ret.y);
		ret = draw_icon(canvas, resources['gui_key'], ' ' + bound_entity.info.keys+ ' ', ret.x, ret.y);
		//Draw heart containers (2 rows x 8 pixels)
		
		//Draw 'Tear' and 'Item' boxes next to the entity's sprite
		bound_entity.sprite.draw(canvas, this.x + this.width / 2 - bound_entity.sprite.width / 2, ret.y + 25);
	};
};