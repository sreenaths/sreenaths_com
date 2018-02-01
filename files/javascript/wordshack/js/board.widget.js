$(function() {
	var dialogCount = 0;
	window.showDialog = function() {
		dialogCount++;
		$('#dialog-modal').dialog({
			modal: true
		})
	}

	window.closeDialog = function() {
		dialogCount--;
		if (dialogCount <= 0) {
			$('#dialog-modal').dialog("close");
			dialogCount = 0;
		}
	}

	function getTileHolderClass(i, j) {
		var cls = ['', 'dl', 'tl', 'dw', 'tw'];
		return cls[boardLayout[i][j]];
	}

	$.widget("mmoscrabble.board", {
		options: {
			tileHolderSize: 60,
			numTiles: 20,
			boardx: -1,
			boardy: -1
		},

		_create: function() {
			self = this;

			this.element
				.empty()
				.css({
					width: this.options.numTiles * this.options.tileHolderSize + 'px',
					height: this.options.numTiles * this.options.tileHolderSize + 'px'
				});
			for(var i=0; i < this.options.numTiles; i++) {
				$boardRow = $('<div class="board-row"></div>');
				for (var j = 0; j < this.options.numTiles; j++) {
					$('<div class="tileholder ' + getTileHolderClass(i, j)  +'"></div>').each(function(){
					   $(this).data('holderx',i);
					   $(this).data('holdery',j);
					}).appendTo($boardRow);
				};
				this.element.append($boardRow);
			}
	
	/*
			self.element.find(".tileholder").droppable({
				//activeClass: "highlightholder",
				drop: function(e, ui) {
					$droppedTileHolder = $(this);
					//$position = $droppedTileHolder.position();
					$droppedTileHolder.append(ui.draggable).droppable("destroy");
					ui.draggable.css({
						position: 'relative',
						left: '2px',
						top: '2px'
					}).addClass('noselect');
					self._trigger("tileplaced", null, {
						boardx: self.options.boardx,
						boardy: self.options.boardy,
						holderx: $.data(this, 'holderx'),
						holdery: $.data(this, 'holdery'),
					});
					ui.draggable.draggable("disable").addClass('tile');
				},
				
			});
	*/
			
			
			self.element.delegate(".tileholder", "mouseenter", function(e) {
				if ($(this).children('.tile').length > 0) return;
				$(this).droppable({
					drop: function(e, ui) {
						$droppedTileHolder = $(this);
						$droppedTileHolder.append(ui.draggable).droppable("destroy");
						ui.draggable.css({
							position: 'relative',
							left: '2px',
							top: '2px'
						}).addClass('noselect');
						self._trigger("tileplaced", null, {
							boardx: self.options.boardx,
							boardy: self.options.boardy,
							holderx: $.data(this, 'holderx'),
							holdery: $.data(this, 'holdery'),
						});
						ui.draggable.draggable("disable").addClass('tile');
					},
				});
			}).delegate(".tileholder", "mouseout", function(e) {
				if ($(this).is("ui-droppable"))
					$(this).droppable("destroy");
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

		setupBoard: function(values) {
			self = this;
			lastr = undefined;
			$.each(values, function(ridx, row) {
				$.each(row, function(cidx, cellvalue) {
					if (cellvalue === 0) return true;
					v = cellvalue.split(":");
					if (lastr == undefined) lastr = self.element.children(":nth-child(" + (ridx + 1) + ")");
					cell = lastr.children(":nth-child(" + (cidx + 1) + ")");
					cell.append(makeTile(v[1]));
				});
				lastr = undefined;
			});
		}
	})
});