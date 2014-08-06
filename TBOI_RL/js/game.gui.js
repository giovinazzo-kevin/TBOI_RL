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

	var draw_icon = function(canvas, icon, text, x, y) {
		icon.draw(canvas, x, y);
		x += icon.width;
		canvas.fillText(text, x, y + icon.height);
		x += canvas.measureText(text).width;
		return { x: x, y: y };
	};

	var heart_coords = function(i, width) {
		var cols = Math.floor(width / resources['gui_emptyheart'].width);
		return { 
			x: (Math.floor(i % cols)) * resources['gui_emptyheart'].width, 
			y: (Math.floor(i / cols)) * resources['gui_emptyheart'].width
		};
	};

	var draw_health = function(canvas, x, y, width) {
		var e = bound_entity.info;
		//Red hearts
		for (var i = 0; i < e.maxhealth; i ++) {
			var ret = heart_coords(i, width);
			if(i + 0.5 < e.health) {
				resources['gui_fullheart'].draw(canvas, x + ret.x, y + ret.y);
			} else if(i - e.health == -1 % e.health) {
				resources['gui_emptyheart'].draw(canvas, x + ret.x, y + ret.y);
				resources['gui_halfheart'].draw(canvas, x + ret.x, y + ret.y);
			} 
			else {
				resources['gui_emptyheart'].draw(canvas, x + ret.x, y + ret.y);
			}
		}
		//Soul hearts
		for (var i = 0; i < e.soulhearts; i ++) {
			var ret = heart_coords(i + e.maxhealth, width);
			if(i + 0.5 < e.soulhearts) {
				resources['gui_fullsoulheart'].draw(canvas, x + ret.x, y + ret.y);
			} else if(i - e.soulhearts == -0.5) {
				resources['gui_emptyheart'].draw(canvas, x + ret.x, y + ret.y);
				resources['gui_halfsoulheart'].draw(canvas, x + ret.x, y + ret.y);
			} 
		}
		//Eternal hearts
		for (var i = 0; i < e.eternalhearts; i ++) {
			var ret = heart_coords(i + e.maxhealth + Math.round(e.soulhearts), width);
			if(i + 0.5 < e.eternalhearts) {
				resources['gui_fulleternalheart'].draw(canvas, x + ret.x, y + ret.y);
			} else if(i - e.eternalhearts == -0.5) {
				resources['gui_emptyheart'].draw(canvas, x + ret.x, y + ret.y);
				resources['gui_halfeternalheart'].draw(canvas, x + ret.x, y + ret.y);
			} 
		}
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
		//Draw health using ret's y parameter + icon.height for vertical offset
		draw_health(canvas, this.x + 1, resources['gui_coin'].height + ret.y + 1, this.width);

		//Draw 'Tear' and 'Item' boxes next to the entity's sprite
		bound_entity.sprite.draw(canvas, this.x + this.width / 2 - bound_entity.sprite.width / 2, ret.y + 25);
		//Draw ent.name
		canvas.fillText(bound_entity.name, this.x + this.width / 2 - canvas.measureText(bound_entity.name).width / 2, ret.y + 35 + bound_entity.sprite.height);
	};
};