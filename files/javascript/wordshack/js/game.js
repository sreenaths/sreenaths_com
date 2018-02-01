	//--- Configs ------------------------------------
	var BOARD_SIZE = 20;

	//--- Configs ------------------------------------
	
	// Cell matrix creator
	function makeBoard( x, y) {
		$board = $('<div class="board"></div>');
		$board.board({
	    	tileplaced: function(e, ui) {
	    		//alert(ui.boardx + ',' + ui.boardy + ',' +  ui.holderx + ',' +  ui.holdery);
	    	},
    		boardx: x,
    		boardy: y
	    });
		return $board;
	}
	
	function makeMapTile( x, y){
		return $('<div class="map-tile"> <img src="icons/map_tile.png"> </div>');
	}
		
	$(document).ready(function() {
		
		var mainMap = new InfiMap( $('#mainContainer'), makeBoard );
		$("#mapWindow").dialog({
			show: "fade",
			autoOpen: false,
			modal: true,
			resizable: false,
			draggable: false,
			width: 600,
			height: 400
		});

		$("#mapButton").click(function(){
			$("#mapWindow").dialog("open");
		});

		$('#bottombar').bottombar();
		
	});
