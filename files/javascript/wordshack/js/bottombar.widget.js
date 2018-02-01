$(function() {

	var bottombarHtml = '<div id="tilecontainer" class="tilecontainer"><div class="tileholder"></div><div class="tileholder"></div><div class="tileholder"></div><div class="tileholder"></div><div class="tileholder"></div><div class="tileholder"></div></div>';
	
	window.makeTile = function(alphabet, isDraggable) {
		isDraggable = typeof isDraggable != undefined ? isDraggable : false;
		$tile = $('<div class="tile">' + alphabet + '</div>');
		if (isDraggable) {
			$tile.draggable({
		    		revert: 'invalid',
		    		opacity: .7,
		    		cursor: 'pointer',
	                cursorAt: { top: -2}
	    	});
		}
		return $tile;
	};

	function getRandomLetter() {
		var text = "";
   		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   		var len = 6;
   		//for( var i=0; i < 6; i++ )
	       	//text += possible.charAt(Math.floor(Math.random() * possible.length));
   		//return text;
   		return possible.charAt(Math.floor(Math.random() * possible.length));
	}
	$.widget("mmoscrabble.bottombar", {
		options: {
			tileContainerSize: 400,
			numTiles: 6,
		},

		_create: function() {
			this.element
				.empty()
				.append(bottombarHtml);

			this.element.find('.tileholder').each(function(idx, elem) {
				$(elem).append(makeTile(getRandomLetter(), true));
			});

			this._refresh();
		},

		_refresh: function() {
			this._trigger("change");
		},

		_destroy: function() {
			//alert("hellow");
		},

		_setOptions: function() {
			this._superApply( arguments );
            this._refresh();
		},

		_setOption: function(key, value) {
			this._super(key, value);
		},
	})
});