
/*--------------------------
	InfiMap.js
	Requires JQuery
--------------------------*/

window.InfiMap = (function(){

	var InfiMap = function( $component, tileMaker, loadWidth, loadHeight ){
		
		this.component = $component;
		this._loadWidthFactor = Math.floor((loadWidth||3)/2), this._loadHeightFactor = Math.floor((loadHeight||3)/2);
		this._tileMaker = tileMaker;
		this._tileWidth = this._tileHeight = 0;
		this._displayedTiles = {};
		this._prevResetOffset = {};
		
		this._init();

	};
	
	InfiMap.prototype = {
	
		_init: function(){
		
			/*
			var $tile = this._tileMaker( 0, 0 );
			this.component.append( $tile );
			this._tileWidth = $tile.width(), this._tileHeight = $tile.height();
			$tile.remove();
			*/
			this._tileWidth = this._tileHeight = 1200;
			
			this._resetTiles( 0, 0 );
			this._makeDragable();
			
		},
		
		_makeDragable: function(){
			var thisObj = this;
			function onDrag( e, ui ){
				var position = thisObj.component.position();
				thisObj._resetTiles( -Math.floor( position.left/thisObj._tileWidth ), -Math.floor(position.top/thisObj._tileHeight) );
			}
			this.component.draggable({
				start: onDrag,
				stop: onDrag,
				drag: onDrag
			});
		},
		
		_resetTiles: function( offsetX, offsetY ){
		
			if( this._prevResetOffset.x==offsetX && this._prevResetOffset.y==offsetY ) return;
			
			var newTiles = {};
			var posX = 0 , posY = 0, tileId = "";
			
			for( var y=-this._loadHeightFactor; y<=this._loadHeightFactor; y++ ){
				for( var x=-this._loadWidthFactor; x<=this._loadWidthFactor; x++ ){
					posX = offsetX+x, posY = offsetY+y;
					tileId = posX+"_"+posY;
					if( this._displayedTiles[tileId] ) newTiles[ tileId ] = this._displayedTiles[tileId];
					else this.component.append( newTiles[ tileId ] = this._createTile( posX, posY ) );
				}
			}
			
			// Delete old invicible tiles
			for( tileId in this._displayedTiles )
				if( !newTiles[tileId] ){
					this._displayedTiles[tileId].remove();
				}

			this._displayedTiles = newTiles;
			this._prevResetOffset = {
				x: offsetX,
				y: offsetY
			};
			
		},
		
		_createTile: function( x, y ){
			var $tile = this._tileMaker( x, y );
			$tile.css({
				left: x*this._tileWidth,
				top: y*this._tileHeight
			});
			return $tile;
		},
		
		gotoTile: function( x, y ){
			
		}
		
	};
	
	return InfiMap;
	
})();